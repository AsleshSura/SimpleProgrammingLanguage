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

    print("Pipeline Testing!")
    passed = 0
    failed = 0

    for code, expected in test_cases:
        print(f"\nTest: {code}")

        try:
            result = interpret(code)
            print(f"Expected: {expected}")
            print(f"Got: {result}")

            if result == expected:
                print("PASSED")
                passed += 1
            else:
                print("FAILED - Wrong result")
                failed += 1
        
        except Exception as e:
            print(f"FAILED - Error: {e}")
            failed += 1
    
    print("Results:")
    print(f"Passed: {passed}")
    print(f"Failed: {failed}")
    print(f"Sucess rate: {passed}/{passed + failed}")

def test_variable_persistence():
    print