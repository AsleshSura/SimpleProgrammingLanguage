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
