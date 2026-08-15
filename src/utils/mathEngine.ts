/**
 * YUKTI Scientific Math Engine
 * Robust tokenizer, AST / Shunting-yard expression evaluator supporting
 * standard arithmetic, advanced scientific, trigonometric (DEG/RAD/GRAD),
 * hyperbolic, roots, logarithms, powers, factorials, modulo, constants and memory.
 */

export type AngleMode = 'DEG' | 'RAD' | 'GRAD';

export interface EvaluationResult {
  success: boolean;
  result?: number;
  formattedResult?: string;
  error?: string;
}

export interface CalculationHistoryItem {
  id: string;
  expression: string;
  formattedExpression: string;
  result: string;
  numericResult: number;
  angleMode: AngleMode;
  timestamp: number;
}

// Factorial helper with gamma approximation for non-integers
export function factorial(n: number): number {
  if (n < 0) throw new Error("Factorial undefined for negative numbers");
  if (n > 170) throw new Error("Overflow (result > 10^308)");
  if (Math.floor(n) !== n) {
    return gamma(n + 1);
  }
  let res = 1;
  for (let i = 2; i <= n; i++) {
    res *= i;
  }
  return res;
}

// Lanczos approximation for Gamma function
function gamma(z: number): number {
  const g = 7;
  const C = [
    0.99999999999980993,
    676.5203681218851,
    -1259.1392167224028,
    771.32342877765313,
    -176.61502916214059,
    12.507343278686905,
    -0.138571095836526,
    9.9843695780195716e-6,
    1.5056327351493116e-7,
  ];

  if (z < 0.5) {
    return Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z));
  }
  z -= 1;
  let x = C[0];
  for (let i = 1; i < g + 2; i++) {
    x += C[i] / (z + i);
  }
  const t = z + g + 0.5;
  return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
}

// Angle unit helpers
export function toRadians(angle: number, mode: AngleMode): number {
  switch (mode) {
    case 'DEG':
      return (angle * Math.PI) / 180;
    case 'GRAD':
      return (angle * Math.PI) / 200;
    case 'RAD':
    default:
      return angle;
  }
}

export function fromRadians(rad: number, mode: AngleMode): number {
  switch (mode) {
    case 'DEG':
      return (rad * 180) / Math.PI;
    case 'GRAD':
      return (rad * 200) / Math.PI;
    case 'RAD':
    default:
      return rad;
  }
}

// Clean floating point errors (e.g. 0.1 + 0.2 -> 0.3, sin(180°) -> 0)
export function cleanFloat(val: number, precision = 12): number {
  if (!isFinite(val)) return val;
  if (Math.abs(val) < 1e-14) return 0;
  const factor = Math.pow(10, precision);
  const rounded = Math.round(val * factor) / factor;
  return rounded;
}

// Format numbers with elegant scientific display
export function formatResultNumber(num: number, maxDecimals = 10): string {
  if (isNaN(num)) return "Error";
  if (!isFinite(num)) return num > 0 ? "Infinity" : "-Infinity";

  const cleaned = cleanFloat(num, 14);

  // Check if huge or tiny
  const abs = Math.abs(cleaned);
  if ((abs >= 1e12 || (abs < 1e-7 && abs > 0))) {
    return cleaned.toExponential(6).replace('e+', 'e').replace('e0', '');
  }

  // Regular representation with commas in integer part
  const str = cleaned.toString();
  if (str.includes('.')) {
    const parts = str.split('.');
    const intPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    let decPart = parts[1];
    if (decPart.length > maxDecimals) {
      decPart = decPart.substring(0, maxDecimals);
      // Remove trailing zeroes
      decPart = decPart.replace(/0+$/, '');
      if (!decPart) return intPart;
    }
    return `${intPart}.${decPart}`;
  } else {
    return str.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
}

// Tokenizer and Safe Math Evaluator
export class MathEvaluator {
  private angleMode: AngleMode;

  constructor(angleMode: AngleMode = 'DEG') {
    this.angleMode = angleMode;
  }

  setAngleMode(mode: AngleMode) {
    this.angleMode = mode;
  }

  getAngleMode(): AngleMode {
    return this.angleMode;
  }

  /**
   * Evaluate mathematical expression safely
   */
  public evaluate(rawExpr: string): EvaluationResult {
    let trimmed = rawExpr.trim();
    if (!trimmed) {
      return { success: true, result: 0, formattedResult: '0' };
    }

    try {
      const tokens = this.tokenize(trimmed);
      if (tokens.length === 0) {
        return { success: true, result: 0, formattedResult: '0' };
      }

      const rpn = this.shuntingYard(tokens);
      const res = this.evaluateRPN(rpn);

      if (isNaN(res)) {
        return { success: false, error: 'Invalid calculation' };
      }

      if (!isFinite(res)) {
        return { success: false, error: 'Cannot divide by zero' };
      }

      const cleaned = cleanFloat(res);
      return {
        success: true,
        result: cleaned,
        formattedResult: formatResultNumber(cleaned)
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'Syntax Error'
      };
    }
  }

  private tokenize(expr: string): string[] {
    let s = expr
      .replace(/,/g, '') // remove thousand separators from inputs
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-')
      .replace(/°/g, '') // strip degree signs
      .replace(/²/g, '^2')
      .replace(/³/g, '^3')
      .replace(/\[/g, '(')
      .replace(/\]/g, ')')
      .replace(/\{/g, '(')
      .replace(/\}/g, ')')
      .replace(/π/g, ' PI ')
      .replace(/φ/g, ' PHI ')
      .replace(/MOD/gi, ' mod ')
      .replace(/√\(/g, 'sqrt(')
      .replace(/√(\d+(\.\d+)?)/g, 'sqrt($1)')
      .replace(/∛\(/g, 'cbrt(')
      .replace(/∛(\d+(\.\d+)?)/g, 'cbrt($1)')
      .replace(/(\d+(\.\d+)?)%/g, '($1/100)')
      .replace(/(\d+(\.\d+)?)e\+?(-?\d+)/gi, '($1*10^$3)');

    // Count open vs closed parentheses and auto-balance if unclosed at end
    let openParens = (s.match(/\(/g) || []).length;
    let closeParens = (s.match(/\)/g) || []).length;
    while (openParens > closeParens) {
      s += ')';
      closeParens++;
    }

    // Regex for tokens
    const tokenRegex = /([0-9]+\.?[0-9]*|\.[0-9]+|sin⁻¹|cos⁻¹|tan⁻¹|asin|acos|atan|sinh|cosh|tanh|sin|cos|tan|cot|sec|csc|log₂|log2|log10|log|ln|sqrt|cbrt|yroot|fact|abs|exp|mod|PI|PHI|e|\+|\-|\*|\/|\^|\!|%|\(|\)|,)/g;

    const matches = s.match(tokenRegex) || [];
    const tokens: string[] = [];

    for (let i = 0; i < matches.length; i++) {
      let t = matches[i].trim();
      if (!t) continue;

      // Handle custom symbols
      if (t === 'sin⁻¹') t = 'asin';
      if (t === 'cos⁻¹') t = 'acos';
      if (t === 'tan⁻¹') t = 'atan';
      if (t === 'log₂') t = 'log2';
      if (t.toLowerCase() === 'mod') t = 'mod';
      if (t === 'PI') t = `${Math.PI}`;
      if (t === 'PHI') t = '1.618033988749895';
      if (t === 'e') t = `${Math.E}`;

      // Insert implicit multiplication: e.g. 2(3), (2)(3), 2sin(30), 2PI, (5)2
      if (tokens.length > 0) {
        const prev = tokens[tokens.length - 1];
        const isPrevNumOrParenClose = this.isNumber(prev) || prev === ')';
        const isCurrFuncOrParenOpen = this.isFunction(t) || t === '(' || this.isNumber(t);

        if (isPrevNumOrParenClose && (t === '(' || this.isFunction(t))) {
          tokens.push('*');
        } else if (prev === ')' && this.isNumber(t)) {
          tokens.push('*');
        }
      }

      tokens.push(t);
    }

    // Handle unary minus
    const refined: string[] = [];
    for (let i = 0; i < tokens.length; i++) {
      const curr = tokens[i];
      const prev = i > 0 ? refined[refined.length - 1] : null;

      if (curr === '-' || curr === '+') {
        if (!prev || prev === '(' || prev === ',' || this.isOperator(prev)) {
          if (curr === '-') {
            refined.push('u-');
          }
          continue;
        }
      }
      refined.push(curr);
    }

    return refined;
  }

  private isNumber(token: string): boolean {
    return !isNaN(Number(token)) && token !== '';
  }

  private isFunction(token: string): boolean {
    const fns = [
      'sin', 'cos', 'tan', 'cot', 'sec', 'csc',
      'asin', 'acos', 'atan',
      'sinh', 'cosh', 'tanh',
      'log', 'ln', 'log2', 'log10',
      'sqrt', 'cbrt', 'abs', 'exp'
    ];
    return fns.includes(token.toLowerCase());
  }

  private isOperator(token: string): boolean {
    return ['+', '-', '*', '/', '^', '%', 'mod', '!', 'u-', 'yroot'].includes(token);
  }

  private getPrecedence(op: string): number {
    switch (op) {
      case '!':
        return 6;
      case 'u-':
        return 5;
      case '^':
      case 'yroot':
        return 4;
      case '*':
      case '/':
      case '%':
      case 'mod':
        return 3;
      case '+':
      case '-':
        return 2;
      default:
        return 0;
    }
  }

  private isRightAssociative(op: string): boolean {
    return op === '^' || op === 'u-';
  }

  private shuntingYard(tokens: string[]): string[] {
    const output: string[] = [];
    const opStack: string[] = [];

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];

      if (this.isNumber(token)) {
        output.push(token);
      } else if (this.isFunction(token)) {
        opStack.push(token);
      } else if (token === ',') {
        while (opStack.length && opStack[opStack.length - 1] !== '(') {
          output.push(opStack.pop()!);
        }
        if (opStack.length === 0) {
          throw new Error("Mismatched parentheses or comma error");
        }
      } else if (this.isOperator(token)) {
        const p1 = this.getPrecedence(token);
        const rightAssoc = this.isRightAssociative(token);

        while (opStack.length > 0) {
          const top = opStack[opStack.length - 1];
          if (top === '(') break;

          const p2 = this.getPrecedence(top);
          if (this.isFunction(top) || (rightAssoc ? p1 < p2 : p1 <= p2)) {
            output.push(opStack.pop()!);
          } else {
            break;
          }
        }
        opStack.push(token);
      } else if (token === '(') {
        opStack.push(token);
      } else if (token === ')') {
        let foundOpen = false;
        while (opStack.length > 0) {
          const top = opStack.pop()!;
          if (top === '(') {
            foundOpen = true;
            break;
          } else {
            output.push(top);
          }
        }
        if (!foundOpen) {
          throw new Error("Mismatched parentheses");
        }
        if (opStack.length > 0 && this.isFunction(opStack[opStack.length - 1])) {
          output.push(opStack.pop()!);
        }
      }
    }

    while (opStack.length > 0) {
      const top = opStack.pop()!;
      if (top === '(' || top === ')') {
        throw new Error("Mismatched parentheses");
      }
      output.push(top);
    }

    return output;
  }

  private evaluateRPN(rpn: string[]): number {
    const stack: number[] = [];

    for (const token of rpn) {
      if (this.isNumber(token)) {
        stack.push(parseFloat(token));
      } else if (token === 'u-') {
        if (stack.length < 1) throw new Error("Invalid negative operator");
        const a = stack.pop()!;
        stack.push(-a);
      } else if (token === '!') {
        if (stack.length < 1) throw new Error("Factorial requires an operand");
        const a = stack.pop()!;
        stack.push(factorial(a));
      } else if (this.isOperator(token)) {
        if (stack.length < 2) throw new Error(`Operator ${token} missing operand`);
        const b = stack.pop()!;
        const a = stack.pop()!;

        switch (token) {
          case '+':
            stack.push(a + b);
            break;
          case '-':
            stack.push(a - b);
            break;
          case '*':
            stack.push(a * b);
            break;
          case '/':
            if (b === 0) throw new Error("Cannot divide by zero");
            stack.push(a / b);
            break;
          case '%':
          case 'mod':
            if (b === 0) throw new Error("Cannot divide by zero");
            stack.push(a % b);
            break;
          case '^':
            stack.push(Math.pow(a, b));
            break;
          case 'yroot':
            if (a === 0 && b <= 0) throw new Error("Root undefined");
            if (a % 2 === 0 && b < 0) throw new Error("Even root of negative number");
            if (b < 0) {
              stack.push(-Math.pow(-b, 1 / a));
            } else {
              stack.push(Math.pow(b, 1 / a));
            }
            break;
          default:
            throw new Error(`Unknown operator ${token}`);
        }
      } else if (this.isFunction(token)) {
        if (stack.length < 1) throw new Error(`Function ${token}() missing argument`);
        const a = stack.pop()!;
        const mode = this.angleMode;

        switch (token.toLowerCase()) {
          case 'sin': {
            const rad = toRadians(a, mode);
            if (mode === 'DEG' && a % 180 === 0) stack.push(0);
            else if (mode === 'DEG' && (a - 90) % 360 === 0) stack.push(1);
            else if (mode === 'DEG' && (a + 90) % 360 === 0) stack.push(-1);
            else stack.push(Math.sin(rad));
            break;
          }
          case 'cos': {
            const rad = toRadians(a, mode);
            if (mode === 'DEG' && (a - 90) % 180 === 0) stack.push(0);
            else if (mode === 'DEG' && a % 360 === 0) stack.push(1);
            else if (mode === 'DEG' && (a - 180) % 360 === 0) stack.push(-1);
            else stack.push(Math.cos(rad));
            break;
          }
          case 'tan': {
            if (mode === 'DEG' && (a - 90) % 180 === 0) throw new Error("tan undefined at this angle");
            const rad = toRadians(a, mode);
            stack.push(Math.tan(rad));
            break;
          }
          case 'cot': {
            const rad = toRadians(a, mode);
            const t = Math.tan(rad);
            if (Math.abs(t) < 1e-15) throw new Error("cotangent undefined (div by zero)");
            stack.push(1 / t);
            break;
          }
          case 'sec': {
            const rad = toRadians(a, mode);
            const c = Math.cos(rad);
            if (Math.abs(c) < 1e-15) throw new Error("secant undefined (div by zero)");
            stack.push(1 / c);
            break;
          }
          case 'csc': {
            const rad = toRadians(a, mode);
            const s = Math.sin(rad);
            if (Math.abs(s) < 1e-15) throw new Error("cosecant undefined (div by zero)");
            stack.push(1 / s);
            break;
          }
          case 'asin': {
            if (a < -1 || a > 1) throw new Error("asin domain error [-1, 1]");
            const rad = Math.asin(a);
            stack.push(fromRadians(rad, mode));
            break;
          }
          case 'acos': {
            if (a < -1 || a > 1) throw new Error("acos domain error [-1, 1]");
            const rad = Math.acos(a);
            stack.push(fromRadians(rad, mode));
            break;
          }
          case 'atan': {
            const rad = Math.atan(a);
            stack.push(fromRadians(rad, mode));
            break;
          }
          case 'sinh':
            stack.push(Math.sinh(a));
            break;
          case 'cosh':
            stack.push(Math.cosh(a));
            break;
          case 'tanh':
            stack.push(Math.tanh(a));
            break;
          case 'log':
          case 'log10':
            if (a <= 0) throw new Error("Log of non-positive value");
            stack.push(Math.log10(a));
            break;
          case 'ln':
            if (a <= 0) throw new Error("ln of non-positive value");
            stack.push(Math.log(a));
            break;
          case 'log2':
            if (a <= 0) throw new Error("log2 of non-positive value");
            stack.push(Math.log2(a));
            break;
          case 'sqrt':
            if (a < 0) throw new Error("Square root of negative value");
            stack.push(Math.sqrt(a));
            break;
          case 'cbrt':
            stack.push(Math.cbrt(a));
            break;
          case 'abs':
            stack.push(Math.abs(a));
            break;
          case 'exp':
            stack.push(Math.exp(a));
            break;
          default:
            throw new Error(`Unknown function ${token}`);
        }
      }
    }

    if (stack.length !== 1) {
      throw new Error("Invalid expression syntax");
    }

    return stack[0];
  }
}
