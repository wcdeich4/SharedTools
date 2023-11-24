export abstract class Probability
{
    /**
     * get random number in specific range
     * @param minimum {number} minimum value for the specific range
     * @param maximum {number} maximum value for the specific range
     * @returns {number} random number somwhere in the specific range of minimum to maximum
     */
    public static getRandomNumberInRange(minimum: number, maximum: number): number
    {
        return minimum * Math.random() + maximum * Math.random();
    }
}