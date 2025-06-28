let pyodide;

// Embed your Python code as strings (Option B - recommended for GitHub Pages)
const lexerCode = `
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
    GREATER = "GREATER"
    LESS = "LESS"
    COLON = "COLON"
    EOF = "EOF"
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
    def __init__(self, message, line, column):
        self.message = message
        self.line = line
        self.column = column
        super().__init__(f"Lexer Error at line {line}, column {column}: {message}")

class Tokenizer:
    def __init__(self, text):
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
    
    def error(self, message):
        raise LexerError(message, self.line, self.column)
    
    def peek(self, offset=0):
        peek_pos = self.pos + offset
        if peek_pos >= len(self.text):
            return None
        return self.text[peek_pos]

    def advance(self):
        if self.pos >= len(self.text):
            return None
        char = self.text[self.pos]
        self.pos += 1
        if char == "\\n":
            self.line += 1
            self.column = 1
        else:
            self.column += 1
        return char
    
    def skip_whitespace(self):
        while self.peek() and self.peek() in ' \\t':
            self.advance()

    def read_number(self):
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
        if self.peek() and (self.peek().isalpha() or self.peek() == "_"):
            self.error("Invalid token: numbers cannot be followed by letters")
        return Token(TokenType.NUMBER, result, self.line, start_column)
    
    def read_identifier(self):
        start_column = self.column
        result = ""
        if not (self.peek().isalpha() or self.peek() == "_"):
            self.error("Invalid identifier start")
        while (self.peek() and (self.peek().isalnum() or self.peek()== "_")):
            result += self.advance()
        token_type = self.keywords.get(result, TokenType.IDENTIFIER)
        return Token(token_type, result, self.line, start_column)
    
    def read_string(self):
        start_column = self.column
        quote_char = self.advance()
        result = ""
        while self.peek() and self.peek() != quote_char:
            char = self.advance()
            if char == "\\\\":
                next_char = self.advance()
                if next_char == "n":
                    result += "\\n"
                elif next_char == "t":
                    result += "\\t"
                elif next_char == "\\\\":
                    result += "\\\\"
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

    def next_token(self):
        while self.peek():
            current_char = self.peek()
            start_column = self.column
            if current_char in " \\t":
                self.skip_whitespace()
                continue
            if current_char == "\\n":
                self.advance()
                return Token(TokenType.NEWLINE, "\\\\n", self.line - 1, start_column)
            if current_char.isdigit():
                return self.read_number()
            if current_char.isalpha() or current_char == "_":
                return self.read_identifier()
            if current_char in '"\\\'':
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

    def tokenize(self):
        tokens = []
        while True:
            token = self.next_token()
            tokens.append(token)
            if token.type == TokenType.EOF:
                break
        if len(tokens) >= 2:
            second_last_token = tokens[-2]
            if second_last_token.type in [TokenType.PLUS, TokenType.MINUS, TokenType.MULTIPLY, TokenType.DIVIDE]:
                raise LexerError(f"Incomplete expression: trailing operator '{second_last_token.value}'", 
                               second_last_token.line, second_last_token.column)
        return tokens
`;

const astCode = `
class ASTNode:
    pass

class Number(ASTNode):
    def __init__(self, value):
        self.value = float(value)

class String(ASTNode):
    def __init__(self, value):
        self.value = value

class Variable(ASTNode):
    def __init__(self, name):
        self.name = name

class BinOp(ASTNode):
    def __init__(self, left, op, right):
        self.left = left
        self.op = op
        self.right = right

class UnaryOp(ASTNode):
    def __init__(self, op, operand):
        self.op = op
        self.operand = operand

class Assign(ASTNode):
    def __init__(self, name, value):
        self.name = name
        self.value = value

class Print(ASTNode):
    def __init__(self, expr):
        self.expr = expr

class If(ASTNode):
    def __init__(self, condition, then_branch, else_branch=None):
        self.condition = condition
        self.then_branch = then_branch
        self.else_branch = else_branch

class While(ASTNode):
    def __init__(self, condition, body):
        self.condition = condition
        self.body = body

class Program(ASTNode):
    def __init__(self, statements):
        self.statements = statements
`;

const parserCode = `
class Parser:
    def __init__(self, tokens):
        self.tokens = tokens
        self.pos = 0

    def current_token(self):
        if self.pos < len(self.tokens):
            return self.tokens[self.pos]
        return None
    
    def peek_token(self, offset=1):
        peek_pos = self.pos + offset
        if peek_pos < len(self.tokens):
            return self.tokens[peek_pos]
        return None
    
    def advance(self):
        if self.pos < len(self.tokens):
            self.pos += 1

    def expect(self, token_type):
        token = self.current_token()
        if token and token.type == token_type:
            self.advance()
            return token
        raise SyntaxError(f"Expected {token_type}, got {token.type if token else 'EOF'}")
    
    def parse_statement(self):
        token = self.current_token()
        if not token:
            return None
        if token.type == TokenType.IDENTIFIER and self.peek_token() and self.peek_token().type == TokenType.ASSIGN:
            return self.parse_assignment()
        elif token.type == TokenType.IF:
            return self.parse_if()
        elif token.type == TokenType.WHILE:
            return self.parse_while()
        else:
            expr = self.parse_expression()
            return expr
        
    def parse_assignment(self):
        name = self.expect(TokenType.IDENTIFIER).value
        self.expect(TokenType.ASSIGN)
        value = self.parse_expression()
        return Assign(name, value)
    
    def parse_if(self):
        self.expect(TokenType.IF)
        condition = self.parse_expression()
        self.expect(TokenType.COLON)
        then_branch = [self.parse_statement()]
        else_branch = None
        if self.current_token() and self.current_token().type == TokenType.ELSE:
            self.advance()
            self.expect(TokenType.COLON)
            else_branch = [self.parse_statement()]
        return If(condition, then_branch, else_branch)
    
    def parse_while(self):
        self.expect(TokenType.WHILE)
        condition = self.parse_expression()
        self.expect(TokenType.COLON)
        body = [self.parse_statement()]
        return While(condition, body)
    
    def parse_expression(self):
        return self.parse_comparison()
    
    def parse_comparison(self):
        expr = self.parse_addition()
        while self.current_token() and self.current_token().type in [TokenType.GREATER, TokenType.LESS]:
            op = self.current_token().value
            self.advance()
            right = self.parse_addition()
            expr = BinOp(expr, op, right)
        return expr
    
    def parse_addition(self):
        expr = self.parse_multiplication()
        while self.current_token() and self.current_token().type in [TokenType.PLUS, TokenType.MINUS]:
            op = self.current_token().value
            self.advance()
            right = self.parse_multiplication()
            expr = BinOp(expr, op, right)
        return expr

    def parse_multiplication(self):
        expr = self.parse_unary()
        while self.current_token() and self.current_token().type in [TokenType.MULTIPLY, TokenType.DIVIDE]:
            op = self.current_token().value
            self.advance()
            right = self.parse_unary()
            expr = BinOp(expr, op, right)
        return expr
    
    def parse_unary(self):
        if self.current_token() and self.current_token().type == TokenType.MINUS:
            op = self.current_token().value
            self.advance()
            operand = self.parse_unary()
            return UnaryOp(op, operand)
        return self.parse_primary()

    def parse_primary(self):
        token = self.current_token()
        if not token:
            raise SyntaxError("Unexpected end of input")
        if token.type == TokenType.NUMBER:
            self.advance()
            return Number(token.value)
        elif token.type == TokenType.STRING:
            self.advance()
            return String(token.value)
        elif token.type == TokenType.IDENTIFIER:
            self.advance()
            return Variable(token.value)
        elif token.type == TokenType.LPAREN:
            self.advance()
            expr = self.parse_expression()
            self.expect(TokenType.RPAREN)
            return expr
        else:
            raise SyntaxError(f"Unexpected token: {token.type}")

    def parse(self):
        statements = []
        while self.current_token() and self.current_token().type != TokenType.EOF:
            if self.current_token().type == TokenType.NEWLINE:
                self.advance()
                continue
            statement = self.parse_statement()
            if statement:
                statements.append(statement)
        return Program(statements)

def parse(code):
    tokenizer = Tokenizer(code)
    tokens = tokenizer.tokenize()
    parser = Parser(tokens)
    return parser.parse()
`;

const interpreterCode = `
# The interpreter module - depends on AST and parser modules being loaded first

class Interpreter:
    def __init__(self):
        self.variables = {}

    def visit(self, node):
        method_name = f'visit_{node.__class__.__name__}'
        method = getattr(self, method_name, self.generic_visit)
        return method(node)

    def generic_visit(self, node):
        raise Exception(f"No visit method for {node.__class__.__name__}")

    def visit_Program(self, node):
        result = None
        for statement in node.statements:
            result = self.visit(statement)
        return result

    def visit_Number(self, node):
        return float(node.value)
    
    def visit_String(self, node):
        return node.value
    
    def visit_Variable(self, node):
        if node.name in self.variables:
            return self.variables[node.name]
        else:
            raise NameError(f"Variable '{node.name}' is not defined")
        
    def visit_BinOp(self, node):
        left = self.visit(node.left)
        right = self.visit(node.right)
        if node.op == "+":
            return left + right
        elif node.op == "-":
            return left - right
        elif node.op == "*":
            return left * right
        elif node.op == "/":
            if right == 0:
                raise ZeroDivisionError("Division by zero")
            return left / right
        elif node.op == '>':
            return left > right
        elif node.op == '<':
            return left < right
        else:
            raise Exception(f"Unknown binary operator: {node.op}")
    
    def visit_UnaryOp(self, node):
        operand = self.visit(node.operand)
        if node.op == '-':
            return -operand
        else:
            raise Exception(f"Unknown unary operator: {node.op}")
    
    def visit_Assign(self, node):
        value = self.visit(node.value)
        self.variables[node.name] = value
        return value
    
    def visit_Print(self, node):
        value = self.visit(node.expr)
        print(value)
        return value
    
    def visit_If(self, node):
        condition = self.visit(node.condition)
        if condition:
            result = None
            for statement in node.then_branch:
                result = self.visit(statement)
            return result
        elif node.else_branch:
            result = None
            for statement in node.else_branch:
                result = self.visit(statement)
            return result
        return None
    
    def visit_While(self, node):
        result = None
        while self.visit(node.condition):
            for statement in node.body:
                result = self.visit(statement)
        return result

def interpret(code):
    ast = parse(code)
    interpreter = Interpreter()
    return interpreter.visit(ast)
`;

async function initializePyodide(){
    pyodide = await loadPyodide();
    console.log("Pyodide loaded successfully");
}

function runUserCode(userInput){
    try {
        // Escape quotes in user input to prevent Python syntax errors
        const escapedInput = userInput.replace(/"/g, '\\"').replace(/'/g, "\\'").replace(/\n/g, '\\n');
        
        const result = pyodide.runPython(`
try:
    result = interpret("${escapedInput}")
    result
except Exception as e:
    f"Error: {str(e)}"
        `);
        return result;
    } catch (error) {
        return `Error: ${error.message}`;
    }
}

async function main() {
    try {
        await initializePyodide();
        
        // Load everything as one integrated module
        console.log("Loading Simple Programming Language...");
        pyodide.runPython(`
# All-in-one Simple Programming Language implementation

from enum import Enum
from dataclasses import dataclass
from typing import List, Optional

# Token definitions
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
    GREATER = "GREATER"
    LESS = "LESS"
    COLON = "COLON"
    EOF = "EOF"
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
    def __init__(self, message, line, column):
        self.message = message
        self.line = line
        self.column = column
        super().__init__(f"Lexer Error at line {line}, column {column}: {message}")

# AST Node definitions
class ASTNode:
    pass

class Number(ASTNode):
    def __init__(self, value):
        self.value = float(value)

class String(ASTNode):
    def __init__(self, value):
        self.value = value

class Variable(ASTNode):
    def __init__(self, name):
        self.name = name

class BinOp(ASTNode):
    def __init__(self, left, op, right):
        self.left = left
        self.op = op
        self.right = right

class UnaryOp(ASTNode):
    def __init__(self, op, operand):
        self.op = op
        self.operand = operand

class Assign(ASTNode):
    def __init__(self, name, value):
        self.name = name
        self.value = value

class Print(ASTNode):
    def __init__(self, expr):
        self.expr = expr

class If(ASTNode):
    def __init__(self, condition, then_branch, else_branch=None):
        self.condition = condition
        self.then_branch = then_branch
        self.else_branch = else_branch

class While(ASTNode):
    def __init__(self, condition, body):
        self.condition = condition
        self.body = body

class Program(ASTNode):
    def __init__(self, statements):
        self.statements = statements

# Lexer implementation
class Tokenizer:
    def __init__(self, text):
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
    
    def error(self, message):
        raise LexerError(message, self.line, self.column)
    
    def peek(self, offset=0):
        peek_pos = self.pos + offset
        if peek_pos >= len(self.text):
            return None
        return self.text[peek_pos]

    def advance(self):
        if self.pos >= len(self.text):
            return None
        char = self.text[self.pos]
        self.pos += 1
        if char == "\\n":
            self.line += 1
            self.column = 1
        else:
            self.column += 1
        return char
    
    def skip_whitespace(self):
        while self.peek() and self.peek() in ' \\t':
            self.advance()

    def read_number(self):
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
        if self.peek() and (self.peek().isalpha() or self.peek() == "_"):
            self.error("Invalid token: numbers cannot be followed by letters")
        return Token(TokenType.NUMBER, result, self.line, start_column)
    
    def read_identifier(self):
        start_column = self.column
        result = ""
        if not (self.peek().isalpha() or self.peek() == "_"):
            self.error("Invalid identifier start")
        while (self.peek() and (self.peek().isalnum() or self.peek()== "_")):
            result += self.advance()
        token_type = self.keywords.get(result, TokenType.IDENTIFIER)
        return Token(token_type, result, self.line, start_column)
    
    def read_string(self):
        start_column = self.column
        quote_char = self.advance()
        result = ""
        while self.peek() and self.peek() != quote_char:
            char = self.advance()
            if char == "\\\\":
                next_char = self.advance()
                if next_char == "n":
                    result += "\\n"
                elif next_char == "t":
                    result += "\\t"
                elif next_char == "\\\\":
                    result += "\\\\"
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

    def next_token(self):
        while self.peek():
            current_char = self.peek()
            start_column = self.column
            if current_char in " \\t":
                self.skip_whitespace()
                continue
            if current_char == "\\n":
                self.advance()
                return Token(TokenType.NEWLINE, "\\\\n", self.line - 1, start_column)
            if current_char.isdigit():
                return self.read_number()
            if current_char.isalpha() or current_char == "_":
                return self.read_identifier()
            if current_char in '"\\\'':
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

    def tokenize(self):
        tokens = []
        while True:
            token = self.next_token()
            tokens.append(token)
            if token.type == TokenType.EOF:
                break
        if len(tokens) >= 2:
            second_last_token = tokens[-2]
            if second_last_token.type in [TokenType.PLUS, TokenType.MINUS, TokenType.MULTIPLY, TokenType.DIVIDE]:
                raise LexerError(f"Incomplete expression: trailing operator '{second_last_token.value}'", 
                               second_last_token.line, second_last_token.column)
        return tokens

# Parser implementation
class Parser:
    def __init__(self, tokens):
        self.tokens = tokens
        self.pos = 0

    def current_token(self):
        if self.pos < len(self.tokens):
            return self.tokens[self.pos]
        return None
    
    def peek_token(self, offset=1):
        peek_pos = self.pos + offset
        if peek_pos < len(self.tokens):
            return self.tokens[peek_pos]
        return None
    
    def advance(self):
        if self.pos < len(self.tokens):
            self.pos += 1

    def expect(self, token_type):
        token = self.current_token()
        if token and token.type == token_type:
            self.advance()
            return token
        raise SyntaxError(f"Expected {token_type}, got {token.type if token else 'EOF'}")
    
    def parse_statement(self):
        token = self.current_token()
        if not token:
            return None
        if token.type == TokenType.IDENTIFIER and self.peek_token() and self.peek_token().type == TokenType.ASSIGN:
            return self.parse_assignment()
        elif token.type == TokenType.IF:
            return self.parse_if()
        elif token.type == TokenType.WHILE:
            return self.parse_while()
        else:
            expr = self.parse_expression()
            return expr
        
    def parse_assignment(self):
        name = self.expect(TokenType.IDENTIFIER).value
        self.expect(TokenType.ASSIGN)
        value = self.parse_expression()
        return Assign(name, value)
    
    def parse_if(self):
        self.expect(TokenType.IF)
        condition = self.parse_expression()
        self.expect(TokenType.COLON)
        then_branch = [self.parse_statement()]
        else_branch = None
        if self.current_token() and self.current_token().type == TokenType.ELSE:
            self.advance()
            self.expect(TokenType.COLON)
            else_branch = [self.parse_statement()]
        return If(condition, then_branch, else_branch)
    
    def parse_while(self):
        self.expect(TokenType.WHILE)
        condition = self.parse_expression()
        self.expect(TokenType.COLON)
        body = [self.parse_statement()]
        return While(condition, body)
    
    def parse_expression(self):
        return self.parse_comparison()
    
    def parse_comparison(self):
        expr = self.parse_addition()
        while self.current_token() and self.current_token().type in [TokenType.GREATER, TokenType.LESS]:
            op = self.current_token().value
            self.advance()
            right = self.parse_addition()
            expr = BinOp(expr, op, right)
        return expr
    
    def parse_addition(self):
        expr = self.parse_multiplication()
        while self.current_token() and self.current_token().type in [TokenType.PLUS, TokenType.MINUS]:
            op = self.current_token().value
            self.advance()
            right = self.parse_multiplication()
            expr = BinOp(expr, op, right)
        return expr

    def parse_multiplication(self):
        expr = self.parse_unary()
        while self.current_token() and self.current_token().type in [TokenType.MULTIPLY, TokenType.DIVIDE]:
            op = self.current_token().value
            self.advance()
            right = self.parse_unary()
            expr = BinOp(expr, op, right)
        return expr
    
    def parse_unary(self):
        if self.current_token() and self.current_token().type == TokenType.MINUS:
            op = self.current_token().value
            self.advance()
            operand = self.parse_unary()
            return UnaryOp(op, operand)
        return self.parse_primary()

    def parse_primary(self):
        token = self.current_token()
        if not token:
            raise SyntaxError("Unexpected end of input")
        if token.type == TokenType.NUMBER:
            self.advance()
            return Number(token.value)
        elif token.type == TokenType.STRING:
            self.advance()
            return String(token.value)
        elif token.type == TokenType.IDENTIFIER:
            self.advance()
            return Variable(token.value)
        elif token.type == TokenType.LPAREN:
            self.advance()
            expr = self.parse_expression()
            self.expect(TokenType.RPAREN)
            return expr
        else:
            raise SyntaxError(f"Unexpected token: {token.type}")

    def parse(self):
        statements = []
        while self.current_token() and self.current_token().type != TokenType.EOF:
            if self.current_token().type == TokenType.NEWLINE:
                self.advance()
                continue
            statement = self.parse_statement()
            if statement:
                statements.append(statement)
        return Program(statements)

# Interpreter implementation
class Interpreter:
    def __init__(self):
        self.variables = {}

    def visit(self, node):
        method_name = f'visit_{node.__class__.__name__}'
        method = getattr(self, method_name, self.generic_visit)
        return method(node)

    def generic_visit(self, node):
        raise Exception(f"No visit method for {node.__class__.__name__}")

    def visit_Program(self, node):
        result = None
        for statement in node.statements:
            result = self.visit(statement)
        return result

    def visit_Number(self, node):
        return float(node.value)
    
    def visit_String(self, node):
        return node.value
    
    def visit_Variable(self, node):
        if node.name in self.variables:
            return self.variables[node.name]
        else:
            raise NameError(f"Variable '{node.name}' is not defined")
        
    def visit_BinOp(self, node):
        left = self.visit(node.left)
        right = self.visit(node.right)
        if node.op == "+":
            return left + right
        elif node.op == "-":
            return left - right
        elif node.op == "*":
            return left * right
        elif node.op == "/":
            if right == 0:
                raise ZeroDivisionError("Division by zero")
            return left / right
        elif node.op == '>':
            return left > right
        elif node.op == '<':
            return left < right
        else:
            raise Exception(f"Unknown binary operator: {node.op}")
    
    def visit_UnaryOp(self, node):
        operand = self.visit(node.operand)
        if node.op == '-':
            return -operand
        else:
            raise Exception(f"Unknown unary operator: {node.op}")
    
    def visit_Assign(self, node):
        value = self.visit(node.value)
        self.variables[node.name] = value
        return value
    
    def visit_Print(self, node):
        value = self.visit(node.expr)
        print(value)
        return value
    
    def visit_If(self, node):
        condition = self.visit(node.condition)
        if condition:
            result = None
            for statement in node.then_branch:
                result = self.visit(statement)
            return result
        elif node.else_branch:
            result = None
            for statement in node.else_branch:
                result = self.visit(statement)
            return result
        return None
    
    def visit_While(self, node):
        result = None
        while self.visit(node.condition):
            for statement in node.body:
                result = self.visit(statement)
        return result

# Main interface functions
def parse(code):
    tokenizer = Tokenizer(code)
    tokens = tokenizer.tokenize()
    parser = Parser(tokens)
    return parser.parse()

def interpret(code):
    ast = parse(code)
    interpreter = Interpreter()
    return interpreter.visit(ast)

print("Simple Programming Language loaded successfully!")
        `);
        
        // Test that everything works
        console.log("Testing the language...");
        
        // First, let's test if the functions exist
        const functionCheck = pyodide.runPython(`
success_count = 0
total_checks = 6

if 'TokenType' in globals():
    print("✓ TokenType exists")
    success_count += 1
if 'Tokenizer' in globals():
    print("✓ Tokenizer exists") 
    success_count += 1
if 'Parser' in globals():
    print("✓ Parser exists")
    success_count += 1
if 'Interpreter' in globals():
    print("✓ Interpreter exists")
    success_count += 1
if 'parse' in globals():
    print("✓ parse function exists")
    success_count += 1
if 'interpret' in globals():
    print("✓ interpret function exists")
    success_count += 1

print(f"Function check: {success_count}/{total_checks} passed")

# Return True if all functions exist, False otherwise
success_count == total_checks
        `);
        
        console.log("Function check result:", functionCheck);
        
        if (functionCheck !== true) {
            throw new Error("Required functions not loaded properly");
        }
        
        const testResult = pyodide.runPython(`
import traceback
test_passed = False
try:
    print("\\n=== Running Language Test ===")
    print("Testing: 2 + 3")
    
    # Step by step test
    print("1. Creating tokenizer...")
    tokenizer = Tokenizer("2 + 3")
    print("2. Tokenizing...")
    tokens = tokenizer.tokenize()
    print(f"   Tokens: {len(tokens)} found")
    
    print("3. Creating parser...")
    parser = Parser(tokens)
    print("4. Parsing...")
    ast = parser.parse()
    print("   AST created successfully")
    
    print("5. Creating interpreter...")
    interpreter = Interpreter()
    print("6. Interpreting...")
    result = interpreter.visit(ast)
    
    print(f"✓ Test successful: 2 + 3 = {result}")
    print(f"   Result type: {type(result)}")
    test_passed = True
    
except Exception as e:
    print(f"✗ Test failed at step: {e}")
    print("Full traceback:")
    traceback.print_exc()
    test_passed = False

print(f"\\n=== Test Complete: {'PASSED' if test_passed else 'FAILED'} ===")
test_passed
        `);
        
        console.log("Language test result:", testResult);
        
        if (testResult === true) {
            console.log("Your programming language is ready!");
            
            // Enable the input field
            const input = document.getElementById('command-input');
            if (input) {
                input.disabled = false;
                input.placeholder = "Enter your code here...";
            }
            
            // Update status
            const status = document.getElementById('status');
            if (status) {
                status.textContent = "Ready! Your programming language is loaded.";
                status.style.color = "#00ff00";
            }
        } else {
            console.log("Test failed! Running diagnostics...");
            // Try to get more debug info
            const debugInfo = pyodide.runPython(`
try:
    print("\\n=== DIAGNOSTIC MODE ===")
    print("Available globals:")
    available_names = [name for name in globals().keys() if not name.startswith('_')]
    print(f"  {len(available_names)} items: {', '.join(sorted(available_names)[:10])}...")
    
    # Try basic Python
    print("\\nTesting basic Python:")
    result = 2 + 3
    print(f"  2 + 3 = {result} ✓")
    
    # Try to create a simple tokenizer
    print("\\nTesting tokenizer creation:")
    try:
        tok = Tokenizer("5")
        print("  Tokenizer created ✓")
        
        print("\\nTesting tokenization:")
        tokens = tok.tokenize()
        print(f"  Tokenized '5' into {len(tokens)} tokens ✓")
        print(f"  Token types: {[t.type.name for t in tokens]}")
    except Exception as tok_error:
        print(f"  Tokenizer failed: {tok_error}")
        import traceback
        traceback.print_exc()
    
    "diagnostic_complete"
except Exception as e:
    print(f"Diagnostic failed: {e}")
    import traceback
    traceback.print_exc()
    "diagnostic_failed"
            `);
            console.log("Diagnostic result:", debugInfo);
            throw new Error("Language test failed - see detailed diagnostics in console");
        }
        
    } catch (error) {
        console.error("Failed to initialize:", error);
        
        // Also try to get Python error details and show them on the page
        try {
            const pythonError = pyodide.runPython(`
import traceback
import sys
from io import StringIO

# Capture the last error if any
error_output = StringIO()
if hasattr(sys, 'last_traceback'):
    traceback.print_tb(sys.last_traceback, file=error_output)
    error_output.getvalue()
else:
    "No Python traceback available"
            `);
            
            console.log("Python error details:", pythonError);
        } catch (e) {
            console.log("Could not get Python error details:", e);
        }
        
        const status = document.getElementById('status');
        if (status) {
            status.innerHTML = `
                <div style="color: #ff4444;">Error loading language: ${error.message}</div>
                <div style="color: #ffaa00; font-size: 12px; margin-top: 10px;">
                    Check browser console (F12) for detailed error information.
                    <br>Try refreshing the page if this persists.
                </div>
            `;
        }
    }
}

// Initialize when page loads
main();

// Add event listeners for user interaction
document.addEventListener('DOMContentLoaded', function() {
    const input = document.getElementById('command-input');
    const output = document.getElementById('output');
    
    let commandHistory = [];
    let historyIndex = -1;
    
    input.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            const command = input.value.trim();
            if (command) {
                executeCommand(command);
                commandHistory.push(command);
                historyIndex = commandHistory.length;
                input.value = '';
            }
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            if (historyIndex > 0) {
                historyIndex--;
                input.value = commandHistory[historyIndex];
            }
        } else if (event.key === 'ArrowDown') {
            event.preventDefault();
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                input.value = commandHistory[historyIndex];
            } else {
                historyIndex = commandHistory.length;
                input.value = '';
            }
        }
    });
    
    function executeCommand(command) {
        // Add command to output
        addToOutput(`<div class="command-line"><span class="prompt">>>> </span>${escapeHtml(command)}</div>`);
        
        // Execute the command
        const result = runUserCode(command);
        
        // Add result to output
        if (result !== undefined && result !== null) {
            const resultClass = result.toString().startsWith('Error:') ? 'error-line' : 'output-line';
            addToOutput(`<div class="${resultClass}">${escapeHtml(result.toString())}</div>`);
        }
        
        // Scroll to bottom
        output.scrollTop = output.scrollHeight;
    }
    
    function addToOutput(html) {
        output.innerHTML += html;
    }
    
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // Focus input when clicking anywhere on terminal
    document.querySelector('.terminal-body').addEventListener('click', function() {
        input.focus();
    });
});