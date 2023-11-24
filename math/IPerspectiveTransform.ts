import { GenericVector } from "./GenericVector";

export interface IPerspectiveTransform
{
    tranform(world3DVector: GenericVector<number> ): GenericVector<number> ;
}