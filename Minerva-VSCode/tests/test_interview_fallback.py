import os
import sys
import unittest

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from Resume_Analyzer.llm.interview import generate_interview_questions, evaluate_interview_answers


class InterviewFallbackTests(unittest.TestCase):
    def test_generate_interview_questions_without_api_key(self):
        os.environ.pop('GROQ_API_KEY', None)
        result = generate_interview_questions('Frontend Engineer', [
            {'skill': 'React', 'score': 4},
            {'skill': 'JavaScript', 'score': 3},
            {'skill': 'Testing', 'score': 2},
        ], 5)
        self.assertTrue(result['success'])
        self.assertEqual(len(result['data']), 5)
        self.assertEqual([q['id'] for q in result['data']], ['q1', 'q2', 'q3', 'q4', 'q5'])

    def test_evaluate_interview_answers_without_api_key(self):
        os.environ.pop('GROQ_API_KEY', None)
        result = evaluate_interview_answers(
            [
                {'id': 'q1', 'question': 'Explain React state.'},
                {'id': 'q2', 'question': 'Explain closures.'},
                {'id': 'q3', 'question': 'How do you test UI?'} ,
                {'id': 'q4', 'question': 'Explain async data fetching.'},
                {'id': 'q5', 'question': 'Describe performance tuning.'},
            ],
            [
                {'id': 'q1', 'answer': 'I use useState and props.'},
                {'id': 'q2', 'answer': 'Closures let functions capture state.'},
                {'id': 'q3', 'answer': 'I write component tests with React Testing Library.'},
                {'id': 'q4', 'answer': 'I fetch data in useEffect and handle loading states.'},
                {'id': 'q5', 'answer': 'I reduce rerenders with memoization.'},
            ],
            'Frontend Engineer',
        )
        self.assertTrue(result['success'])
        self.assertEqual(len(result['data']['scores']), 5)
        self.assertEqual(len(result['data']['feedback']), 5)


if __name__ == '__main__':
    unittest.main()
