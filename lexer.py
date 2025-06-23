from enum import Enum

class TokenType(Enum):
    NUMBER = "NUMBER"
    PLUS = "PLUS"
    EOF = "EOF" #End of life

class Token:
    def __init__(self, type, value):
        self.type = type
        self.value = value
    
    def __str__(self):
        return f"Token({self.type}, {self.value})"

class Lexer:
    def __init__(self, text):
        self.text = text
        self.pos = 0
        self.current_char = self.text[0] if text else None
    
    def advance(self):
        self.pos += 1
        if self.pos >= len(self.text):
            self.current_char = None
        else:
            self.current_char = self.text[self.pos]
    
    def skip_whitespace(self):
        while self.current_char and self.current_char in ' \t':
            self.advance()

    def read_number(self):
        num = ""
        while self.current_char and self.current_char.isdigit():
            num += self.current_char
            self.advance()
        return int(num)

    def get_next_token(self):


        while self.current_char:
            if self.current_char in " \t":
                self.skip_whitespace()
                continue

            if self.current_char.isdigit():
                return Token(TokenType.NUMBER, self.read_number())
            
            if self.current_char == '+':
                self.advance()
                return Token(TokenType.PLUS, "+")
            
            raise Exception(f"Unknown character: {self.current_char}")
        
        return Token(TokenType.EOF, None)
            