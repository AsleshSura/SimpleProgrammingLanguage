from lexer import Lexer, TokenType

text = "123+23"
lexer = Lexer(text)

print("Tokens:")
while True:
    token = lexer.get_next_token()
    print(token)
    if token.type == TokenType.EOF:
        break