from ..llm.client import GroqRateLimitError, get_structured_llm_response
from ..llm.client import normalize_llm_text


def _fallback_answer_evaluation(question, student_answer, skill_id):
    text = (student_answer or '').strip().lower()
    keywords = [
        'algorithm', 'debug', 'optimi', 'design', 'data', 'state', 'test', 'tradeoff', 'problem', 'structure',
        'scale', 'performance', 'security', 'model', 'architecture', 'system', 'evaluate', 'measure', 'explain',
        'why', 'how', 'when', 'compare', 'decide'
    ]
    keyword_hits = sum(1 for keyword in keywords if keyword in text)
    is_correct = len(text) > 30 and (keyword_hits >= 2 or 'because' in text or 'example' in text or 'in practice' in text)
    reasoning = (
        'The answer gives practical reasoning and demonstrates some understanding of the concept.'
        if is_correct else
        'The answer is too brief or lacks enough concrete reasoning to confidently show the concept is understood.'
    )
    return {"is_correct": bool(is_correct), "reasoning": reasoning}


def evaluate_route3_answer(question, student_answer, skill_id):
    readable_skill = skill_id.replace('_', ' ')
    system_prompt = f"""You are a technical interviewer evaluating a student's answer to a question testing "{readable_skill}".

Question: "{question}"

Grading criteria:
- Mark is_correct as TRUE if the student identifies the correct core concept, technique, or approach —
  even if they omit secondary details (e.g. complexity analysis, full justification), or phrase their
  answer with hedging or uncertain tone (e.g. "I think", "maybe", "not sure but").
- Mark is_correct as FALSE only if the core concept/technique itself is wrong, missing, or the answer
  is too vague to identify any correct technical content at all.
- Regardless of the true/false verdict, your reasoning must note anything the student omitted (missing
  justification, incomplete explanation) and comment on their tone/confidence if relevant, so they get
  useful feedback even when marked correct.

Respond with ONLY valid JSON, no markdown, no extra text, in this exact shape:
{{"is_correct": true or false, "reasoning": "1-2 sentences noting both correctness and what could improve"}}"""

    try:
        response = get_structured_llm_response(system_prompt, student_answer)
        return response
    except GroqRateLimitError:
      raise
    except Exception:
        return _fallback_answer_evaluation(question, student_answer, skill_id)
