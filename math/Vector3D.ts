import { ICloneable } from './ICloneable';
// import { RealNumberMatrix } from './RealNumberMatrix';
import { RealNumberVector } from './RealNumberVector';
export class Vector3D extends RealNumberVector implements ICloneable<Vector3D>
{
    /**
     * 3D vector
     * @constructor
     * @param {number} x - x component of the vector.
     * @param {number} y - y component of the vector.
     * @param {number} z - z component of the vector.
     */
    constructor(x?: number, y?: number, z?: number)
    {
        super(null, 3);
        this.elements[0] = x ?? 0;
        this.elements[1] = y ?? 0;
        this.elements[2] = z ?? 0;
    }

    /**
     * Get the right handed cross product of this vector and another vector
     * @param {Vector3D} otherVector to get cross product with
     */
    public crossProduct(otherVector: Vector3D): Vector3D
    {
        return new Vector3D(this.elements[1] * otherVector.elements[2] - this.elements[2] * otherVector.elements[1] ,
                            this.elements[2] * otherVector.elements[0] - this.elements[0] * otherVector.elements[2] ,
                            this.elements[0] * otherVector.elements[1] - this.elements[1] * otherVector.elements[0]);
    }

    /**
     * implement ICloneable
     * @returns new Vector3D with the same values as this one.
     */
    public clone(): Vector3D
    {
        return new Vector3D( this.elements[0], this.elements[1], this.elements[2]);
    }

    /**
     * true if z component is zero
     * @returns boolean
     */
    public is2D(): boolean
    {
        return this.elements[2]=== 0;
    }

    // /**
    //  * get just x and y
    //  * @returns Vector2D
    //  */
    // public to2D(): Vector2D
    // {
    //     return new Vector2D(this.elements[0], this.elements[1]); 
    // }


 


}
