from enum import Enum
from dataclasses import dataclass
from typing import List, Optional
import string


class TokenType(Enum):
    NUMBER = "NUMBER"
    PLUS = "PLUS"
    MINUS = "MINUS"
    MULTIPLY = "MULTIPLY"
    DIVIDE = "DIVIDE"
    LPAREN = "LPAREN"
    RPAREN = "RPAREN"

    IDENTIFIER = "IDENTIFIER"
    STRING = "STRING"
    ASSIGN = "ASSIGN"

    IF = "IF"
    ELSE = "ELSE"
    DEF = "DEF"
    WHILE = "WHILE"

    # Comparison operators
    GREATER = "GREATER"
    LESS = "LESS"
    COLON = "COLON"

    EOF = "EOF" #End of file
    NEWLINE = "NEWLINE"

class Token:
    def __init__(self, type, value, line, column):
        self.type = type
        self.value = value
        self.line = line
        self.column = column
    
    def __str__(self):
        return f"Token({self.type}, {self.value})"

class LexerError(Exception):
    def __init__(self, message: str, line:int, column:int):
        self.message = message
        self.line = line
        self.column = column
        super().__init__(f"Lexer Error at line {line}, column {column}: {message}")

class Tokenizer:
    def __init__(self, text:str):
        self.text = text
        self.pos = 0
        self.line = 1
        self.column = 1

        self.keywords = {
            "if": TokenType.IF,
            "else": TokenType.ELSE,
            "def": TokenType.DEF,
            "while": TokenType.WHILE
        }
    
    def error(self, message:str):
        raise LexerError(message, self.line, self.column)
    
    def peek(self, offset: int = 0) -> Optional[str]:
        peek_pos = self.pos + offset

        if peek_pos >= len(self.text):
            return None
        return self.text[peek_pos]

    def advance(self):
        if self.pos >= len(self.text):
            return None
        
        char = self.text[self.pos]
        self.pos+=1

        if char == "\n":
            self.line += 1
            self.column = 1
        else:
            self.column += 1

        return char
    
    def skip_whitespace(self):
        while self.peek() and self.peek() in ' \t':
            self.advance()

    def read_number(self) -> Token:
        start_column = self.column
        result = ""

        has_decimal = False
        while self.peek() and (self.peek().isdigit() or self.peek() == "."):
            char = self.advance()
            if char == ".":
                if has_decimal:
                    self.error("Invalid number: multiple decimal points")
                has_decimal = True
            result += char

        if not any(c.isdigit() for c in result):
            self.error("Invalid number format")
        
        # Check if number is immediately followed by letters (invalid identifier)
        if self.peek() and (self.peek().isalpha() or self.peek() == "_"):
            self.error("Invalid token: numbers cannot be followed by letters")
        
        return Token(TokenType.NUMBER, result, self.line, start_column)
    
    def read_identifier(self) -> Token:
        start_column = self.column
        result = ""

        if not (self.peek().isalpha() or self.peek() == "_"):
            self.error("Invalid identifier start")
        
        while (self.peek() and (self.peek().isalnum() or self.peek()== "_")):
            result += self.advance()

        token_type = self.keywords.get(result, TokenType.IDENTIFIER)

        return Token(token_type, result, self.line, start_column)
    
    def read_string(self) -> Token:
        start_column = self.column
        quote_char = self.advance()
        result = ""

        while self.peek() and self.peek() != quote_char:
            char = self.advance()

            if char == "\\":
                next_char = self.advance()
                if next_char == "n":
                    result += "\n"
                elif next_char == "t":
                    result += "\t"
                elif next_char == "\\":
                    result += "\\"
                elif next_char == quote_char:
                    result += quote_char
                else:
                    result += next_char
            else:
                result += char
        
        if not self.peek():
            self.error("Unterminated string literal")
        self.advance()

        return Token(TokenType.STRING, result, self.line, start_column)

    def next_token(self) -> Token:

        while self.peek():
            current_char = self.peek()
            start_column = self.column

            if current_char in " \t":
                self.skip_whitespace()
                continue
            
            if current_char == "\n":
                self.advance()
                return Token(TokenType.NEWLINE, "\\n", self.line - 1, start_column)

            if current_char.isdigit():
                return self.read_number()

            if current_char.isalpha() or current_char == "_":
                return self.read_identifier()
            
            if current_char in '"\'':
                return self.read_string()
            
            self.advance()
            
            if current_char == '+':
                return Token(TokenType.PLUS, "+", self.line, start_column)
            elif current_char == "-":
                return Token(TokenType.MINUS, "-", self.line, start_column)
            elif current_char == "*":
                return Token(TokenType.MULTIPLY, "*", self.line, start_column)
            elif current_char == "/":
                return Token(TokenType.DIVIDE, "/", self.line, start_column)
            elif current_char == "(":
                return Token(TokenType.LPAREN, "(", self.line, start_column)
            elif current_char == ")":
                return Token(TokenType.RPAREN, ")", self.line, start_column)
            elif current_char == "=":
                return Token(TokenType.ASSIGN, "=", self.line, start_column)
            elif current_char == ">":
                return Token(TokenType.GREATER, ">", self.line, start_column)
            elif current_char == "<":
                return Token(TokenType.LESS, "<", self.line, start_column)
            elif current_char == ":":
                return Token(TokenType.COLON, ":", self.line, start_column)
            else:
                self.error(f"Unexpected Character: '{current_char}'")
        
        return Token(TokenType.EOF, "", self.line, self.column)

    def tokenize(self) -> List[Token]:
        tokens = []

        while True:
            token = self.next_token()
            tokens.append(token)

            if token.type == TokenType.EOF:
                break
        
        # Check for incomplete expressions (trailing operators)
        if len(tokens) >= 2:
            second_last_token = tokens[-2]  # Second to last token (before EOF)
            if second_last_token.type in [TokenType.PLUS, TokenType.MINUS, TokenType.MULTIPLY, TokenType.DIVIDE]:
                raise LexerError(f"Incomplete expression: trailing operator '{second_last_token.value}'", 
                               second_last_token.line, second_last_token.column)
        
        return tokens