"""Regression tests for user-selected Journey 1 roadmap generation."""

import copy
import json
import unittest
from pathlib import Path

from roadmap_engine import generate_roadmap


ROOT = Path(__file__).resolve().parent


class SelectedJourney1RoadmapTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        with (ROOT / "journey1_final_result.json").open(encoding="utf-8") as handle:
            cls.journey1_output = json.load(handle)

    def test_selected_career_returns_one_roadmap(self):
        result = generate_roadmap(
            journey=1,
            journey_output=self.journey1_output,
            career="development",
            weekly_hours=5,
            use_model=False,
        )

        self.assertIsInstance(result, dict)
        self.assertEqual(result["career"], "development")

    def test_zero_evidence_selected_career_starts_from_scratch(self):
        payload = copy.deepcopy(self.journey1_output)
        payload["preliminary_current_skill_profile"] = [
            skill
            for skill in payload["preliminary_current_skill_profile"]
            if skill.get("career") != "development"
        ]

        result = generate_roadmap(
            journey=1,
            journey_output=payload,
            career="development",
            weekly_hours=5,
            use_model=False,
        )

        self.assertIsInstance(result, dict)
        self.assertEqual(result["career"], "development")
        self.assertTrue(result["meta"]["from_scratch"])
        self.assertEqual(result["meta"]["starting_phase"], "foundation")
        self.assertEqual(
            result["meta"]["first_scheduled_resource_level"],
            result["meta"]["lowest_available_resource_level"],
        )


if __name__ == "__main__":
    unittest.main()
