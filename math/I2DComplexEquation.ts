import { ComplexPoint } from "./ComplexPoint";

export interface I2DComplexEquation
{
    color: string | CanvasGradient | CanvasPattern;
    evaluateAt(c: ComplexPoint): ComplexPoint;
}