from lexer import Tokenizer, TokenType, LexerError

def test_tokenizer():

    test_cases = [
        ("2 + 3", "Basic math"),
        ("2 + 3 * 4", "Operator test"),
        ("12.5 / 2.0", "decimals"),
        ("(2+3)", "Parentheses"),
        ("(2+3) * 4", "Para with oper"),
        ("((1+2)*3)", "Nested parantheses"),

        ("x", "simple identi"),
        ("my_var", "Identifer con underscore"),
        ("count123", "identi w numbers"),
        ("_priv", "Identi start w underscore"),

        ("If", "if keyword"),
        ("Else", "else keyword"),
        ("def", "def keyword"),
        ("while", "while keyword"),

        ("hello", "Simple string"),
        ("'world'", "single quote str"),
        ('"hello world"', "string w spaces"),
        ('"hello\\nworld"', "string con esc seq"),

        ("x = 5", "simple var"),
        ('name = "Alice"', "String Assignment"),
        ("result = 2 + 3", "String with escape Sequence"),

        ("if x > 0:","If statement start"),
        ("def func()","Func def start"),
        ("while count < 10:","While loop start"),
        ("(X+y)*2","Complex Expression"),
        ('message = "hello, " + name',"String concat"),
    ]

    passed = 0
    failed = 0

    for i, (code, description) in enumerate(test_cases, 1):
        print(f"\n Test {i}: {description}")
        print(f"    Input: {code}")

        try:
            tokenizer = Tokenizer(code)
            tokens = tokenizer.tokenize()

            token_display = []
            for token in tokens:
                if token.type != TokenType.EOF:
                    token_display.append(f"{token.type.name}:'{token.value}")
            
            print(f"    Tokens: [{", ".join(token_display)}]")
            print(" PASSED!")
            passed += 1

        except LexerError as e:
            print(f" FAILED: {e}")
            failed += 1
        except Exception as e:
            print(f"    UNEXPECTED ERROR: {e}")
    
    print()
    print(f"Results: {passed} passed, {failed} failed")

    if failed == 0:
        print("Everything passed!")
    else:
        print("Oh no. Error.")
    
    return failed == 0

def test_error_cases():
    
    print(" Testing Error Handling")
    print("=" * 30)
    
    error_cases = [
        ("2.5.3", "Invalid number with multiple decimals"),
        ('"unterminated string', "Unterminated string literal"),
        ("123abc", "Invalid identifier starting with number"),
        ("@#$", "Invalid characters"),
        ("2 + ", "Incomplete expression"),
    ]
    
    for code, description in error_cases:
        print(f"\n Error Test: {description}")
        print(f"   Input: {code}")
        
        try:
            tokenizer = Tokenizer(code)
            tokens = tokenizer.tokenize()
            print("     Expected error but got tokens:", 
                  [f"{t.type.name}:'{t.value}'" for t in tokens if t.type != TokenType.EOF])
        except LexerError as e:
            print(f"    Correctly caught error: {e}")
        except Exception as e:
            print(f"    Unexpected error type: {e}")

def interactive_test():
    print("Enter Code to tokenize (or 'quit' to exit): ")
    print("-"*40)

    while True:
        try:
            user_input = input(">>> ").strip()

            if user_input.lower() in ["quit", "exit", "q"]:
                print("Exited the test")
                break
        
            if not user_input:
                continue

            tokenizer = Tokenizer(user_input)
            tokens = tokenizer.tokenize()

            print("Tokens:")
            for token in tokens:
                if token.type != TokenType.EOF:
                    print(f" {token.type.name}: '{token.value}' (line {token.line}, col {token.column})")
        
        except LexerError as e:
            print(f"LEXER ERROR: {e}")
        except KeyboardInterrupt:
            print("Exited the test")
            break
        except Exception as e:
            print(f" UNEXPECTED ERROR: {e}")

if __name__ == "__main__":
    success = test_tokenizer()

    test_error_cases()

    print("\n" + "-"*50)
    response = input("Want to start interactive testing? (y/n):").lower()
    if response.startswith("y"):
        interactive_test()
    
    print("SUCCESS" if success else "Failed.")