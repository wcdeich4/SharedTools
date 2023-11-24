import { EquatableWithTolerance } from './EquatableWithTolerance';
import { GenericMatrix } from './GenericMatrix';
import { GenericVector } from './GenericVector';
import { ICloneable } from './ICloneable';
import { RealNumberVector } from './RealNumberVector';
import { Vector3D } from './Vector3D';
export class RealNumberMatrix extends GenericMatrix<number> implements ICloneable<RealNumberMatrix>
{
    /**
     * constructor
     * @param array2D array of array of number or null
     * @param numberOfRows number or null
     * @param numberOfColumns number or null
     */
    constructor(array2D?: Array<Array<number>>, numberOfRows?: number, numberOfColumns?: number)
    {
        super();
        if (array2D == null)
        {
            if ((numberOfRows != null) )
            {
                this.elements = new Array<Array<number>>(numberOfRows);

                if (numberOfColumns != null)
                {
                    for(let i = 0; i < numberOfRows; i++)
                    {
                        this.elements[i] = new Array<number>(numberOfColumns);
                    }
                }
            }
        }
        else 
        {
            this.elements = array2D;
        }

    }

    /**
     * create look at matrix like in OpenGL, except row-major math is the default.
     * https://www.geertarien.com/blog/2017/07/30/breakdown-of-the-lookAt-function-in-OpenGL
     * https://medium.com/@carmencincotti/lets-look-at-magic-lookat-matrices-c77e53ebdf78
     * @param cameraPosition {Vector3D} camera poisition in 3D cartesian coordinates
     * @param focalPoint {Vector3D} point to look at in 3D cartesian coordinates
     * @param upVector {Vector3D} up vector in 3D cartesian coordinates (approximate is ok)
     * @param columnMajorOutput {boolean}
     * @returns {RealNumberMatrix} look at matrix
     */
    public static getLookAtMatrix(cameraPosition: Vector3D, focalPoint: Vector3D, upVector: Vector3D, columnMajorOutput: boolean = false ): RealNumberMatrix
    {
        const cameraZAxis: Vector3D = <Vector3D>focalPoint.getDifferenceWith(cameraPosition) as Vector3D; //aka forward vector
        cameraZAxis.normalize();
        const cameraXAxis: Vector3D = cameraZAxis.crossProduct(upVector); //aka right vector
        cameraXAxis.normalize();
        const cameraYAxis: Vector3D = cameraXAxis.crossProduct(cameraZAxis); //aka camera up ?
        cameraZAxis.negate();

        const result = new RealNumberMatrix(null, 3, null);
        result.setRow(0, cameraXAxis);
        result.setRow(1, cameraYAxis);
        result.setRow(2, cameraZAxis);

        const translationX = - cameraXAxis.dotProduct(cameraPosition);
        const translationY = - cameraYAxis.dotProduct(cameraPosition);
        const translationZ = - cameraZAxis.dotProduct(cameraPosition);
        result.setElement(0, 3, translationX);
        result.setElement(1, 3, translationY);
        result.setElement(2, 3, translationZ);

        result.setElement(3, 0, translationZ);
        result.setElement(3, 1, translationZ);
        result.setElement(3, 2, translationZ);
        result.setElement(3, 3, 1);

        if (columnMajorOutput)
        {
            result.transpose();
        }

        return result;
    }

    /**
     * zero out matrix
     */
    public setZeros(): void
    {
        for(let row = 0; row < this.getNumberOfRows(); row++ )
        {
            for(let column = 0; column < this.getNumberOfColumns(); column++)
            {
                this.elements[row][column] = 0;
            }
        }
    }

    /**
     * identity matrix
     */
    public setIdentity(): void
    {
        for(let row = 0; row < this.getNumberOfRows(); row++ )
        {
            for(let column = 0; column < this.getNumberOfColumns(); column++)
            {
                if (row === column)
                {
                    this.elements[row][column] = 1;
                }
                else
                {
                    this.elements[row][column] = 0;
                }
            }
        }
    }

    // /**
    //  * Copy an array to set the data in this matrix
    //  * @param array2d two dimensional array of numbers
    //  * @throws exception if this matrix is has more rows or columns than array2d or array2d is null or undefined
    //  */
    // public copyArray(array2d: number[][]): void
    // {
    //     if (typeof array2d === 'undefined')
    //     {
    //         throw new Error('Exception in GeneralMatrix.Set: array2d is undefined');
    //     }
    //     else if (array2d == null)
    //     {
    //         throw new Error('Exception in GeneralMatrix.Set: array2d is null');
    //     }
    //     if (this.getNumberOfRows() > array2d.length)
    //     {
    //         throw new Error('Exception in GeneralMatrix.Set: this matrix has more rows than the array');
    //     }
    //     if (this.getNumberOfColumns() > array2d[0].length)
    //     {
    //         throw new Error('Exception in GeneralMatrix.Set: this matrix has more rows than the array');
    //     }

    //     for(let row = 0; row < this.getNumberOfRows(); row++ )
    //     {
    //         for(let column = 0; column < this.getNumberOfColumns(); column++)
    //         {
    //             this.elements[row][column] = array2d[row][column];
    //         }
    //     }
    // }

    /**
     * Multiply this matrix by another matrix on the right hand side
     * @param {RealNumberMatrix} rightSideMatrix - the other matrix to multiply by
     * @returns RealNumberMatrix
     * @throws error if the number of rows of this mtrix does not equal the number of columns of the other matrix
     */
    public multiplyBy(rightSideMatrix: RealNumberMatrix): RealNumberMatrix
    {
        if (this.getNumberOfColumns() !== rightSideMatrix.getNumberOfRows())
        {
            throw new Error('Matrix Row Column mismatch.  Cannot multiply');
        }
        else
        {
            const result = new RealNumberMatrix(null, this.getNumberOfRows(), rightSideMatrix.getNumberOfColumns());
            let currentElement: number;
            
            
            let limit = Math.min(this.getNumberOfRows(), rightSideMatrix.getNumberOfColumns()); //treat small matricies as having an infinite number of zeros.

            for(let rightSideMatrixColumnIndex = 0;  rightSideMatrixColumnIndex < limit; rightSideMatrixColumnIndex++)
            {
                for(let leftSideMatrixRow = 0; leftSideMatrixRow < limit; leftSideMatrixRow ++)
                {
                    currentElement = 0;
                    for( let i:number = 0; i < limit; i++)
                    {
                        currentElement += this.elements[leftSideMatrixRow][i] * rightSideMatrix.elements[i][rightSideMatrixColumnIndex];
                    }
                    result.elements[leftSideMatrixRow][rightSideMatrixColumnIndex] = currentElement;
                }
            }




            // for(let row = 0; row < this.getNumberOfRows(); row++ )
            // {
            //     for (let column = 0; column < rightSideMatrix.getNumberOfColumns(); column++)
            //     {
            //         sum = 0;
            //         for (let i = 0; i < rightSideMatrix.getNumberOfRows(); i++) 
            //         {
            //             sum += this.elements[row][i]*rightSideMatrix.elements[i][column];
            //         }
            //         result.elements[row][column] = sum;
            //     }
            // }
            return result;
        }
    }
    

    /**
     * Multiply by a GenericVector<number> on the right hand side
     * @param {GenericVector<number>} rightSideVector - vector to multiply by
     * @throws error if the number of rows of this mtrix does not equal the number of columns of the other matrix
     */
    public multiplyByVectorOnRight(rightSideVector: GenericVector<number>): RealNumberVector
    {
        const vectorLength = rightSideVector.elements.length;
        if (this.getNumberOfColumns() !== vectorLength)
        {
            throw new Error('Matrix Vector column mismatch.  Cannot multiply/transform vector.');
        }
        else
        {
            const result = new RealNumberVector(null, rightSideVector.elements.length);
            let sum: number;
            for(let row = 0; row < this.getNumberOfRows(); row++ )
            {
                // for (let column = 0; column < rightSideMatrix.getNumberOfColumns(); column++)
                // {
                    sum = 0;
                    for (let i = 0; i < vectorLength; i++) 
                    {
                        sum += this.elements[row][i]*rightSideVector.elements[i];
                    }
                    result.elements[row] = sum;
               // }
            }
            return result;
        }
    }

    /**
     * clone
     * @returns RealNumberMatrix
     */
    public clone(): RealNumberMatrix
    {
        const myClone = new RealNumberMatrix(null, this.getNumberOfRows(), this.getNumberOfColumns());
        for(let row = 0; row < this.getNumberOfRows(); row++ )
        {
            for(let column = 0; column < this.getNumberOfColumns(); column++)
            {
                myClone.elements[row][column] = this.elements[row][column];
            }
        }
        return myClone;
    }

    /**
     * Test if matrix is equal to another Matrix. (undefined, null, other types, and vectors with different values return false)
     * @param {any} obj - other vectorto compare.
     */
    public equals(obj: any): boolean
    {
        if (typeof obj === 'undefined')
        {
            return false;
        }
        else if (obj == null)
        {
            return false;
        }
        //TODO : parse json?
        else if (obj instanceof RealNumberMatrix)
        {
            const otherMatrix = obj as RealNumberMatrix;
            if (((typeof this.elements === 'undefined')  && (typeof otherMatrix.elements !== 'undefined'))
            || ((typeof this.elements !== 'undefined')  && (typeof otherMatrix.elements === 'undefined')))
            {
                return false;
            }
            else if ((typeof this.elements === 'undefined')  && (typeof otherMatrix.elements === 'undefined'))
            {
                return true; //vaciously true
            }
            else
            {
                if (((this.elements === null) && (otherMatrix.elements !== null)) || ((this.elements !== null) && (otherMatrix.elements === null)))
                {
                    return false;
                }
                else if ((this.elements === null) && (otherMatrix.elements === null))
                {
                    return true; //vaciously true
                }
                else
                {
                    //they both have data, but do they match?
                    if (this.elements.length !== otherMatrix.elements.length)
                    {
                        return false; //different number of rows
                    }
                    else
                    {
                        for(let row = 0; row < this.elements.length; row++)
                        {
                            if (this.elements[row].length !== otherMatrix.elements[row].length)
                            {
                                return false; //column number miss matc
                            }
                            else
                            {
                                let absoluteDifference: number;
    
                                for(let col = 0; col < this.elements[row].length ; col++)
                                {
                                    absoluteDifference = Math.abs(this.elements[row][col] - otherMatrix.elements[row][col]);
                                    if (absoluteDifference > EquatableWithTolerance.Tolerance)
                                    {
                                        return false;
                                    }
                                }
                            }
                        }
                        //if we get here everything matchedd
                        return true;
                    }
                }
            }


        }
        else
        {
            //some other kind of object
            return false;
        }
    }




}
