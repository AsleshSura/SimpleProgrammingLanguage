from parser import parse
from interpreter import interpret, Interpreter

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
    
    print("\nResults:")
    print(f"Passed: {passed}")
    print(f"Failed: {failed}")
    print(f"Success rate: {passed}/{passed + failed}")

def test_variable_persistence():
    print("\nVariable Test")
    passed = 0
    failed = 0

    interpreter = Interpreter()

    test_sequence = [
        ("x = 10", 10),
        ("y = 5", 5),
        ("x + y", 15),
        ("x * y", 50),
        ("result = x + y * 2", 20)
    ]

    for code, expected in test_sequence:
        print(f"\nExecuting: {code}")
        try:
            ast = parse(code)
            result = interpreter.visit(ast)
            print(f"Result: {result}")
            print(f"Variables: {interpreter.variables}")

            if result == expected:
                print("PASSED")
                passed +=1
            else:
                print(f"FAILED - Expected {expected}, got {result}")
                failed += 1
        except Exception as e:
            print(f"ERROR: {e}")
            failed += 1
    
    print("Results:")
    print(f"Passed: {passed}")
    print(f"Failed: {failed}")
    print(f"Success Rate: {passed}/{passed+failed}")

def interactive_interpreter():
    print("\n Interactive")
    print("Enter expressions or statements (or 'quit' to exit):")
    print("Examples:")
    print(" x = 5")
    print(" y = x + 3")
    print(" x * y")
    print("-" * 50)

    interpreter = Interpreter()

    while True:
        try:
            user_input = input(">>> ").strip()

            if user_input.lower() in ["quit", "exit", "q"]:
                print("BYE!")
                break

            if not user_input:
                continue

            ast = parse(user_input)
            result = interpreter.visit(ast)

            if result is not None:
                print(result)
            
            if interpreter.variables:
                print(f"Variables: {interpreter.variables}")
        
        except KeyboardInterrupt:
            print("\nGoodbye!")
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    test_complete_pipeline()
    test_variable_persistence()

    print("\n" + "=" * 60)

    response = input("Want to try the interactive interpreter? (y/n): ").lower()
    if response.startswith("y"):
        interactive_interpreter()
