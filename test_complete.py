from parser import parse
from interpreter import interpret, interpreter

def test_complete_pipeline():

    test_cases = [
        # Basic Arithmetic
        ("2 + 3", 5),
        ("10 - 4", 6),
        ("3 * 4", 12),
        ("2 + 3 * 4", 14),
        ("(2 + 3) * 4", 20),

        ("x = 5", 5),

        ("5 > 3", True),
        ("2 < 1", False),

        ("-5", -5),
        ("-(3 + 2)", -5)
    ]

    