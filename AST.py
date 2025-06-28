class ASTNode:
    pass

class Number(ASTNode):
    def __init__(self, value):
        self.value = value

class String(ASTNode):
    def __init__(self, value):
        self.value = value

class Identifier(ASTNode):
    def __init__(self, name):
        self.name = name

class BinaryOp(ASTNode):
    def __init__(self, left, operator, right):
        self.left = left
        self.operator = operator
        self.right = right

class UnaryOp(ASTNode):
    def __init__(self, operator, operand):
        self.operator = operator
        self.operand = operand

class Assignment(ASTNode):
    def __init__(self, name, value):
        self.name = name
        self.value = value

class PrintStatement(ASTNode):
    def __init__(self, arguments):
        self.arguments = arguments

class IfStatement(ASTNode):
    def __init__(self, condition, if_body, else_body=None):
        self.condition = condition
        self.if_body = if_body
        self.else_body = else_body

class WhileStatement(ASTNode):
    def __init__(self, condition, body):
        self.condition = condition
        self.body = body

class Program(ASTNode):
    def __init__(self, statements):
        self.statements = statements
