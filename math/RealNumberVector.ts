import { StringHelper } from "../helpers/StringHelper";
import { EquatableWithTolerance } from "./EquatableWithTolerance";
import { GenericVector } from "./GenericVector";
import { ICloneable } from "./ICloneable";

export class RealNumberVector extends GenericVector<number> implements ICloneable<RealNumberVector>
{
    /**
     * constructor
     * @param array1D array of numbers or null
     * @param numberOfElement number or null
     */
    constructor(array1D?:Array<number>, numberOfElement?: number)
    {
        super();
        if (array1D == null)
        {
            if (numberOfElement != null)
            {
                this.elements = new Array<number>(numberOfElement);
            }
        }
        else 
        {
            this.elements = array1D;
        }
    }

    /**
      * set the elements from a delimited string, ignoring non-numeric string elements
      * @param {string} line a delimited string
      * @param {string} delimeter string to split the line string. Any whitespace character will result in parsing on all possible whitespace characters.
     */
    public setFromDelimetedString(line: string, delimeter: string = ' '): void
    {
        let currentLineTokens: Array<string> = null;
        console.log(' line = ' + line);
        if (!StringHelper.isUndefinedOrNullOrEmptyOrWhitespace(line))
        {
            
            if (StringHelper.isUndefinedOrNullOrEmptyOrWhitespace(delimeter))
            {
                currentLineTokens = line.split(/\s+/);
                
                // console.log('currentLineTokens = ' );
                // let i = 0;
                // for( let s in currentLineTokens)
                // {
                //     console.log('element [' + i + '] = ' );
                //     console.log(s);
                //     i++;
                // }

            }
            else
            {
                currentLineTokens = line.split(delimeter);
            }

            //check we have data after split
            if ((currentLineTokens != null) && (currentLineTokens.length > 0))
            {
                //narrow down to only numeric elements after splitting string
                //currentLineTokens = currentLineTokens.filter(a => !StringHelper.isUndefinedOrNullOrEmptyOrWhitespace(a) && StringHelper.isNumeric(a));

                //check again we have data again after filter
                // if ((currentLineTokens != null) && (currentLineTokens.length > 0))
                // {


                console.log(currentLineTokens);


                    //this.elements = null; //probably not necessary
                    this.elements = new Array<number>();


                    for(let index = 0; index < currentLineTokens.length; index++ )
                    {
                        if (!StringHelper.isUndefinedOrNullOrEmptyOrWhitespace(currentLineTokens[index]) && StringHelper.isNumeric(currentLineTokens[index]))
                        {
                        this.elements.push(parseFloat(currentLineTokens[index]));
                            
                        }
                    }

                    // for(let token in currentLineTokens)
                    // {
                    //     console.log(' .......token = ' + token);

                    //     if (!StringHelper.isUndefinedOrNullOrEmptyOrWhitespace(token) && StringHelper.isNumeric(token))
                    //     {
                    //     this.elements.push(parseFloat(token));
                            
                    //     }


                    // }
              //  }
            }
        }
    }



    /**
     * get vector length
     * @returns {number} magnitude of the vector
     */
    public magnitude(): number
    {
        let m = 0;
        if ((this.elements != null) && (this.elements.length > 0))
        {
            for(let i = 0; i < this.elements.length; i++)
            {
                m += this.elements[i] * this.elements[i]; //TODO: compare Math.pow speed in various browsers
            }
        }
        return Math.sqrt(m);
    }

    /**
     * scale vector to length of 1
     */
    public normalize(): void
    {
        let mag = this.magnitude();
        if (mag !== 0)
        {
            for(let i = 0; i < this.elements.length; i++)
            {
                this.elements[i] /= mag; 
            }
        }    
    }

    /**
     * negate this vector
     */
    public negate(): void
    {
        for(let i = 0; i < this.elements.length; i++)
        {
            this.elements[i] = - this.elements[i] ;
        }
    }

    /**
     * get a new vector with value of this vector negated without modifying this vector
     * @returns {RealNumberVector} negated vector
     */
    public getNegated(): RealNumberVector
    {
        const result = this.clone();
        result.negate();
        return result;
    }

    /***
     * Dot Product of this and another vector.  For length mismatch, it treats shorter vectors as longer vectors with as many zero value elements as necessary.
     * @param {GenericVector<number>} otherVector - the vector to dot product multiply with this vector
     * @returns number
     */
    public dotProduct(otherVector: GenericVector<number>): number
    {
        //let length = Math.min(this.elements.length, otherVector.elements.length); //wrong if other vector is longer
        let sum = 0;
        for(let i = 0; i < otherVector.elements.length; i++) //error if otherVector.elements.length > this.elements.length
        {
            sum += this.elements[i] * otherVector.elements[i];
        }
        return sum;
    }

    /***
     * Add another vector to this instance of RealNumberVector. Modifies this object. Treats shorter vectors as longer vectors with as many zero value elements as necessary.
     * @param {GenericVector<number>} otherVector - the vector to add to this vector
     */
    public add(otherVector: GenericVector<number>): void
    {
       // let length = Math.min(this.elements.length, otherVector.elements.length);  //only safe if otherVector cannot be longer
        for(let i = 0; i < otherVector.elements.length; i++) //safe if otherVector is equal or less length
        {
            this.elements[i] += otherVector.elements[i];
        }
    }

    /**
     * Create new RealNumberVector equal to the sum of this RealNumberVector and otherVector without modifying this RealNumberVector or ther otherVector. Does not modifies this object. Treats shorter vectors as longer vectors with as many zero value elements as necessary.
     * @param {GenericVector<number>} otherVector - the vector to get sum with
     * @returns {RealNumberVector} new RealNumberVector with sum of this vector and other RealNumberVector
     */
    public getSumWith(otherVector: GenericVector<number>): RealNumberVector
    {
        const result = this.clone();
        result.add(otherVector);
        return result;
    }

    /***
     * Subtract another vector from this instance of RealNumberVector. Modifies this object. Treats shorter vectors as longer vectors with as many zero value elements as necessary.
     * @param {GenericVector<number>} otherVector - the vector to subtract from this vector
     */
    public subtract(otherVector: GenericVector<number>): void
    {
        //Math.min is only valid safety check if this vector cannot be shorter..........................
        //let length = Math.min(this.elements.length, otherVector.elements.length); 
        for(let i = 0; i < otherVector.elements.length; i++) //error if otherVector is longer, find if shorter
        {
            this.elements[i] -= otherVector.elements[i];
        }
    }

    /**
     * Create new RealNumberVector equal to the this RealNumberVector minus otherVector without modifying this RealNumberVector or ther otherVector. Does not modifies this object. Treats shorter vectors as longer vectors with as many zero value elements as necessary.
     * @param {GenericVector<number>} otherVector - the vector to get difference with
     * @returns {RealNumberVector} new RealNumberVector equal to this vector minus other RealNumberVector
     */
    public getDifferenceWith(otherVector: GenericVector<number>): RealNumberVector
    {
        const result = this.clone();
        result.subtract(otherVector);
        return result;
    }

    /***
     * multiply this instance of RealNumberVector by a scalar.  Changes this RealNumberVector.
     * @param {number} scalar - number to multiply the vector elements by 
     */
    public multiplyByScalar(scalar: number): void
    {
        for(let i = 0; i < this.elements.length; i++)
        {
            this.elements[i] *= scalar;
        }
    }
    //make version that does not change this vector??

    /***
     * divide this instance of RealNumberVector by a scalar.  Changes this RealNumberVector.
     * @param {number} scalar - number to divide the vector elements by 
     */
    public divideByScalar(scalar: number): void
    {
        for(let i = 0; i < this.elements.length; i++)
        {
            this.elements[i] /= scalar;
        }
    }
    //make version that does not change this vector??

    /**
     * Get midpoint between this RealNumberVector and otherVector.  Does not modify this RealNumberVector.
     * @param otherVector {GenericVector<number>} other vector to get midpoint with.
     * @returns {RealNumberVector} midpoint
     */
    public getMidPointWith(otherVector: GenericVector<number>): RealNumberVector
    {
        let result = this.getSumWith(otherVector);
        result.divideByScalar(2);
        return result;
    }

    /**
     * find weighted average of this vector and another vector
     * @param fractionalWeight1 {number} percentage to multiply by this vector
     * @param vector2 {GenericVector<number>} other vector to do weighted average with
     * @param fractionalWeight2 {number} percentage to multiply by 2nd vector
     * @returns {RealNumberVector} weighted average of this vector and another vector
     */
    public getWeightedAverageWithAnotherVector(fractionalWeight1: number, vector2: GenericVector<number>, fractionalWeight2: number): RealNumberVector
    {
        const weightedAveragePoint = this.clone();
      //  weightedAveragePoint.multiplyByScalar(fractionalWeight1);
        //let length = Math.min(this.elements.length, vector2.elements.length);  //wrong if vector2 is longer
        for(let i = 0; i < vector2.elements.length; i++) //safe if vector2 is equal or shorter
        {
            weightedAveragePoint.elements[i] = weightedAveragePoint.elements[i] * fractionalWeight1 + vector2.elements[i] * fractionalWeight2;
        }

        // console.log('fractionalWeight1: ' + fractionalWeight1)
        // console.log('weightedAveragePoint:');
        // console.log(weightedAveragePoint.toString());
        return weightedAveragePoint;
    }

    /**
     * find the distance from this vector to another vector
     * @param otherVector {GenericVector<number>} the other vector to find the distance to
     * @returns {number} the distance
     */
    public getDistanceTo(otherVector: GenericVector<number>): number
    {
        let distance = 0;
        let difference = 0;
       // let length = Math.min(this.elements.length, otherVector.elements.length);  //wrong if otherVector is longer
        for(let i = 0; i < otherVector.elements.length; i++) //error if otherVector.elements.length > this.elements.length
        {
            difference = this.elements[i] - otherVector.elements[i];
            distance +=  difference * difference;
        }

        if (this.elements.length > length)
        {
            for(let i = length; i < this.elements.length; i++)
            {
                distance += this.elements[i] * this.elements[i];
            }
        }

        if (otherVector.elements.length > length)
        {
            for(let i = length; i < otherVector.elements.length; i++)
            {
                distance += otherVector.elements[i] * otherVector.elements[i];
            }
        }

        distance = Math.sqrt(distance);
        return distance;
    }


    /**
     * implement ICloneable
     * @returns new RealNumberVector with the same values as this one.
     */
    public clone(): RealNumberVector
    {
        const myClone = new RealNumberVector();
        if ((this.elements != null) && (this.elements.length > 0))
        {
            myClone.elements = new Array<number>(this.elements.length);
            for(let i = 0; i < this.elements.length; i++ )
            {
                myClone.elements[i] = this.elements[i];
            }
        }
        return myClone;
    }

    /**
     * Test if equal to another vector. (undefined, null, other types, and vectors with different values return false)
     * @param {any} obj - other vectorto compare.
     */
        public equals(obj: any): boolean
        {
            let result = false;
            if (typeof obj === 'undefined')
            {
                result = false;
            }
            else if (obj == null)
            {
                result =  false;
            }
            //TODO : parse json string to match
            else if (obj instanceof GenericVector)
            {
                if ((this.elements == null) && (obj.elements == null))
                {
                    //vacuously true case 1
                    result = true;
                }
                else if ((this.elements.length === 0) && (obj.elements.length === 0))
                {
                    //vacuously true case 2
                    result = true;
                }
                else if (this.elements.length ===  obj.elements.length )
                {
                    result = true;
                    for(let i = 0; i < this.elements.length; i++ )
                    {
                        if (Math.abs(this.elements[i] - obj.elements[i]) > EquatableWithTolerance.Tolerance)
                        {
                            result = false;
                            break;
                        }
                    }
                }
                else 
                {
                    result = false;
                }
            }
            else
            {
                result =  false;
            }
            return result;
        }


}