

class ASTNode:
    pass

class Number(ASTNode):
    def __init__(self, value):
        self.value = int(value)

class Variable(ASTNode):
    def __init__(self, name):
        self.name = name

class BinOp(ASTNode):
    def __init__(self, left, op, right):
        self.left = left
        self.op = op
        self.right = right

class Assign(ASTNode):
    def __init__(self, name, value):
        self.name = name
        self.value = value

class Print(ASTNode):
    def __init__(self, expr):
        self.expr = expr

class Program(ASTNode):
    def __init__(self, statements):
        self.statements = statements
