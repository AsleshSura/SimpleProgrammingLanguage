from lexer import Tokenizer, TokenType
from AST import *

class Parser:
    def __init__(self, tokens):
        self.tokens = tokens
        self.pos = 0

    def current_token(self):
        if self.pos < len(self.tokens):
            return self.tokens[self.pos]
        return None
    
    def peek_token(self, offset = 1):
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
            return self.parse)assignment()
        elif TokenType == TokenType.IF:
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
        self.expect(TokenType.While)
        condition = self.parse_expression()
        self.expect(TokenType.COLON)

        body = [self.parse_statement()]

        return While(condition, body)
    
    def parse_expression(self):
        return self.parse_comparision()
    
    def parse_comparision(self):
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
            right = self.parse_multipication()
            expr = BinOp(expr,op, right)
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
        
        return self.pars_primary()

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