from .client import get_structured_llm_response
from .client import normalize_llm_text
from .prompt_context import summarize_skill_profile


def _deterministic_question_bank(target_role, num_questions=5):
    templates = [
        f"Describe a time you solved a problem in {target_role} using a structured approach.",
        f"How would you debug a production issue in a {target_role} project when the root cause is unclear?",
        f"What trade-offs would you consider when choosing between speed, maintainability, and reliability in {target_role}?",
        f"How do you validate your work in {target_role} to reduce risk before release?",
        f"What would you do to improve a {target_role} system that is currently slow or difficult to maintain?",
    ]
    questions = []
    for index in range(num_questions):
        question = templates[index % len(templates)]
        questions.append({"id": f"q{index + 1}", "question": question, "field": target_role})
    return questions


def _deterministic_evaluation(questions, answers, target_role):
    scores = []
    feedback = []
    for index, item in enumerate(questions):
        answer_text = ""
        for answer in answers:
            if str(answer.get("id") or answer.get("questionId") or "").lower() == str(item.get("id") or "").lower():
                answer_text = str(answer.get("answer") or answer.get("response") or "")
                break
        quality = 1 if answer_text.strip() else 0
        if len(answer_text.strip()) > 80:
            quality = 2
        if "why" in answer_text.lower() or "how" in answer_text.lower() or "trade" in answer_text.lower() or "debug" in answer_text.lower():
            quality = min(2, quality + 1)
        scores.append(max(0, min(2, quality)))

        if quality == 2:
            feedback.append("Strong answer: you explained the approach clearly, showed reasoning, and connected it to practical work in the role.")
        elif quality == 1:
            feedback.append("Solid start: your answer shows relevant thinking, but it could be more specific, structured, and tied to measurable outcomes.")
        else:
            feedback.append("This answer would benefit from more detail: explain your process, trade-offs, and concrete examples to show how you work in practice.")

    return {"scores": scores, "total": sum(scores), "feedback": feedback}


def generate_interview_questions(target_role, skill_profile, num_questions=5):
    try:
        try:
            strengths, gap_summaries = summarize_skill_profile(skill_profile)
        except Exception:
            strengths, gap_summaries = [], []

        system_prompt = f"""
        You are a hiring manager for {target_role} role gauging
        computer science students whether they are suited for {target_role} roles.

        Generate exactly {num_questions} interview questions for {target_role},
        tailored using the student's skill assessment results.

        Strengths = {strengths}
        Skill gaps (ordered by priority) = {gap_summaries}

        Respond with ONLY a valid JSON array of objects, nothing else.
        Each object MUST have exactly these keys: "id", "question", "field".
        "id" must be "q1", "q2", "q3", ... in order.
        "field" must always be "{target_role}".

        Example format:
        [{{"id": "q1", "question": "...", "field": "{target_role}"}},
         {{"id": "q2", "question": "...", "field": "{target_role}"}}]
        """

        response = get_structured_llm_response(system_prompt, "Generate the questions now.")

        if not isinstance(response, list) or len(response) != num_questions:
            return {"success": False, "error": f"Expected {num_questions} questions, got {len(response) if isinstance(response, list) else 'invalid'}"}

        ids = [q.get("id") for q in response]
        if len(set(ids)) != len(ids):
            return {"success": False, "error": "Duplicate question IDs generated"}

        return {"success": True, "data": response}

    except Exception:
        fallback = _deterministic_question_bank(target_role, num_questions)
        return {"success": True, "data": fallback}


def evaluate_interview_answers(questions, answers, target_role):
    try:
        system_prompt = f"""
        You are a hiring manager for {target_role} roles
        evaluating computer science students.

        The student was asked the following interview questions:
        {questions}

        Their answers:
        {answers}

        Evaluate each answer individually.
        Score each question from 0 to 2 (0=poor, 1=adequate, 2=excellent).
        Provide exactly 5 scores (one per question) and exactly 5 feedback items
        (2-3 sentences each).

        Respond with ONLY valid JSON and nothing else.
        No explanation.
        No markdown code fences.
        No extra text.

        Example format:
        {{"scores": [1, 2, 1, 0, 2], "total": 6, "feedback": ["Good understanding of...", "Could improve on...", "...", "...", "..."]}}
        """

        response = get_structured_llm_response(
            system_prompt,
            "Evaluate the answers now."
        )

        if not isinstance(response, dict):
            return {"success": False, "error": "LLM did not return a valid evaluation object"}

        scores = response.get("scores", [])
        if not isinstance(scores, list) or len(scores) != 5:
            return {"success": False, "error": f"Expected 5 scores, got {len(scores) if isinstance(scores, list) else 'invalid'}"}

        feedback = response.get("feedback", [])
        if not isinstance(feedback, list) or len(feedback) != 5:
            return {"success": False, "error": f"Expected 5 feedback items, got {len(feedback) if isinstance(feedback, list) else 'invalid'}"}

        response["scores"] = [max(0, min(2, int(s))) for s in scores]
        response["total"] = sum(response["scores"])

        return {
            "success": True,
            "data": response
        }

    except Exception:
        fallback = _deterministic_evaluation(questions, answers, target_role)
        return {"success": True, "data": fallback}