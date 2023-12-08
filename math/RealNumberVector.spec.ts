import { RealNumberVector } from "./RealNumberVector";

it('Perpendicular Clockwise', () => {
  const a = new RealNumberVector([5, -10]);
  const actualPerpendicularClockwise = a.getPerpendicularClockwise();
  const expectedPerpendicularClockwise = new RealNumberVector([-10, -5]);
  expect(expectedPerpendicularClockwise.equals(actualPerpendicularClockwise)).toEqual(true);
});

it('Perpendicular Counter Clockwise', () => {
  const a = new RealNumberVector([5, -10]);
  const actualPerpendicularCounterClockwise = a.getPerpendicularCounterClockwise();
  const expectedPerpendicularCounterClockwise = new RealNumberVector([10, 5]);
  expect(expectedPerpendicularCounterClockwise.equals(actualPerpendicularCounterClockwise)).toEqual(true);
});

it('RealNumberVector Add Test1', () => {
  const x1 = 99;
  const y1 = -76;
  const u = new RealNumberVector([x1, y1]);
  const v = new RealNumberVector([4, 5]);
  u.add(v);
  expect(u.elements[0]).toEqual(x1 + v.elements[0]);
  expect(u.elements[1]).toEqual(y1 + v.elements[1]);
});

it('RealNumberVector Subtract Test1', () => {
  const x1 = 23;
  const y1 = -78;
  const u = new RealNumberVector([x1, y1]);
  const v = new RealNumberVector([4, 5]);
  u.subtract(v);
  expect(u.elements[0]).toEqual(x1 - v.elements[0]);
  expect(u.elements[1]).toEqual(y1 - v.elements[1]);
});

it('RealNumberVector multiply Test1', () => {
  const x1 = 14;
  const y1 = -58;
  const scalar = 4;
  const u = new RealNumberVector([x1, y1]);
  u.multiplyByScalar(scalar);
  expect(u.elements[0]).toEqual(x1 * scalar);
  expect(u.elements[1]).toEqual(y1 * scalar);
});

it('RealNumberVector divide Test1', () => {
  const x1 = 13;
  const y1 = -57;
  const scalar = 7;
  const u = new RealNumberVector([x1, y1]);
  u.divideByScalar(scalar);
  expect(u.elements[0]).toEqual(x1 / scalar);
  expect(u.elements[1]).toEqual(y1 / scalar);
});


it('RealNumberVector UnitVector test1', () => { 
  const x = 1;
  const y = 2;
  const v1 = new RealNumberVector([x, y]);
  const mag = v1.magnitude();
  v1.normalize();
  const expected = new RealNumberVector([x / mag, y / mag]);
  expect(v1.equals(expected)).toEqual(true);
});

it('RealNumberVector Magnitude test1', () => {
  const v1 = new RealNumberVector([1, 2]);
  const mag = v1.magnitude();
  const expected = Math.sqrt(v1.elements[0] * v1.elements[0] + v1.elements[1] * v1.elements[1] );
  expect(mag).toEqual(expected);
});

it('RealNumberVector MidPoint', () =>
{
  const vector1: RealNumberVector = new RealNumberVector([-2, -3]);
  const vector2: RealNumberVector = new RealNumberVector([2, 3]);
  const midPoint = vector2.getMidPointWith(vector1);
  const expected: RealNumberVector = new RealNumberVector([0, 0]);
  expect(midPoint.equals(expected)).toEqual(true);
});

it('RealNumberVector Weighted Average', () =>
{
  const vector1: RealNumberVector = new RealNumberVector([-2, -3]);
  const percent1: number = 0.5;
  const vector2: RealNumberVector = new RealNumberVector([2, 3]);
  const percent2: number = 0.5;
  const midPoint = vector1.getWeightedAverageWithAnotherVector(percent1, vector2, percent2);
  const expected: RealNumberVector = vector1.clone();
  expected.add(vector2);
  expected.divideByScalar(2);
  expect(midPoint.equals(expected)).toEqual(true);
});



it('RealNumberVector Cross Product test1', () => {
  const a = new RealNumberVector([1, 0, 0]);
  const b = new RealNumberVector([0, 1, 0]);
  const expected = new RealNumberVector([0, 0, 1]);
  const actual = a.crossProduct(b);
  expect(expected.equals(actual)).toEqual(true);
});

it('RealNumberVector Cross Product test2', () => {
  const a = new RealNumberVector([0, 1, 0]);
  const b = new RealNumberVector([0, 0, 1]);
  const expected = new RealNumberVector([1, 0, 0]);
  const actual = a.crossProduct(b);
  expect(expected.equals(actual)).toEqual(true);
});

it('RealNumberVector Cross Product test3', () => {
  const a = new RealNumberVector([1, 0, 0]);
  const b = new RealNumberVector([0, 0, 1]);
  const expected = new RealNumberVector([0, -1, 0]);
  const actual = a.crossProduct(b);
  expect(expected.equals(actual)).toEqual(true);
});

// it('RealNumberVector Cross Product test4', () => {

//   const cameraPosition = new RealNumberVector(10, 0, 0);
//   const origin = new RealNumberVector(0, 0, 0);
//   const focalPoint = <RealNumberVector>origin as RealNumberVector;
//   const upVector = new RealNumberVector(0, 0, 1);

//   const cameraZAxis: RealNumberVector = <RealNumberVector>focalPoint.getDifferenceWith(cameraPosition) as RealNumberVector; //aka forward vector
//   cameraZAxis.normalize();
//   const cameraXAxis: RealNumberVector = cameraZAxis.crossProduct(upVector); //aka right vector
//   cameraXAxis.normalize();
//   const cameraYAxis: RealNumberVector = cameraXAxis.crossProduct(cameraZAxis); //aka camera up ?
//   cameraZAxis.negate();

//   const result = new RealNumberMatrix(null, 3, null);
//   result.setRow(0, cameraXAxis);
//   result.setRow(1, cameraYAxis);
//   result.setRow(2, cameraZAxis);

//   const translationX = - cameraXAxis.dotProduct(cameraPosition);
//   const translationY = - cameraYAxis.dotProduct(cameraPosition);
//   const translationZ = - cameraZAxis.dotProduct(cameraPosition);
//   result.setElement(0, 3, translationX);
//   result.setElement(1, 3, translationY);
//   result.setElement(2, 3, translationZ);

//   result.setElement(3, 0, translationZ);
//   result.setElement(3, 1, translationZ);
//   result.setElement(3, 2, translationZ);
//   result.setElement(3, 3, 1);

//   const lookAtMatrix = RealNumberMatrix.getLookAtMatrix(cameraPosition, focalPoint, upVector);
//   const point1 = new RealNumberVector(0, 5, 0);
//   const projectedPoint = lookAtMatrix.multiplyByVectorOnRight(point1);

//   //unit test hack
//   projectedPoint.elements.pop();
 

//   expect((<RealNumberVector>projectedPoint).equals(origin) ).toEqual(true);

// //  expect(expected.equals(actual)).toEqual(true);





// });

it('RealNumberVector Add Test1', () => {
  const x1 = 99;
  const y1 = -77;
  const z1 = -55;
  const u = new RealNumberVector([x1, y1, z1]);
  const v = new RealNumberVector([4, 5, 6]);
  u.add(v);
  expect(u.elements[0]).toEqual(x1 + v.elements[0]);
  expect(u.elements[1]).toEqual(y1 + v.elements[1]);
  expect(u.elements[2]).toEqual(z1 + v.elements[2]);
});

it('RealNumberVector Subtract Test1', () => {
  const x1 = 22;
  const y1 = -77;
  const z1 = -55;
  const u = new RealNumberVector([x1, y1, z1]);
  const v = new RealNumberVector([4, 5, 6]);
  u.subtract(v);
  expect(u.elements[0]).toEqual(x1 - v.elements[0]);
  expect(u.elements[1]).toEqual(y1 - v.elements[1]);
  expect(u.elements[2]).toEqual(z1 - v.elements[2]);
});

it('RealNumberVector multiply Test1', () => {
  const x1 = 13;
  const y1 = -57;
  const z1 = -66;
  const scalar = 9;
  const u = new RealNumberVector([x1, y1, z1]);
  u.multiplyByScalar(scalar);
  expect(u.elements[0]).toEqual(x1 * scalar);
  expect(u.elements[1]).toEqual(y1 * scalar);
  expect(u.elements[2]).toEqual(z1 * scalar);
});

it('RealNumberVector divide Test1', () => {
  const x1 = 13;
  const y1 = -57;
  const z1 = -66;
  const scalar = 3;
  const u = new RealNumberVector([x1, y1, z1]);
  u.divideByScalar(scalar);
  expect(u.elements[0]).toEqual(x1 / scalar);
  expect(u.elements[1]).toEqual(y1 / scalar);
  expect(u.elements[2]).toEqual(z1 / scalar);
});

it('RealNumberVector UnitVector test1', () => {
  const x = 1;
  const y = 2;
  const z = 3;
  const v1 = new RealNumberVector([x, y, z]);
  const mag = v1.magnitude();
  v1.normalize();
  const expected = new RealNumberVector([x / mag, y / mag, z / mag]);
  expect(v1.equals(expected)).toEqual(true);
});

it('RealNumberVector Magnitude test1', () => {
  const v1 = new RealNumberVector([1, 2, 3]);
  const mag = v1.magnitude();
  const expected = Math.sqrt(v1.elements[0] * v1.elements[0] + v1.elements[1] * v1.elements[1] + v1.elements[2] * v1.elements[2]);
  expect(mag).toEqual(expected);
});




it('RealNumberVector Negate', () => {
  const x1 = 99;
  const y1 = -76;
  const u = new RealNumberVector([x1, y1]);
  const v = u.getNegated();
  for(let i = 0; i < u.elements.length; i++)
  {
    expect(u.elements[i]).toEqual(v.elements[i] * -1);
  }

});

it('Vector 2D Add Test1', () => {
    const x1 = 99;
    const y1 = -76;
    const u = new RealNumberVector([x1, y1]);
    const v = new RealNumberVector([4, 5]);
    u.add(v);
    expect(u.elements[0]).toEqual(x1 + v.elements[0]);
    expect(u.elements[1]).toEqual(y1 + v.elements[1]);
  });

  it('Vector 2D Subtract Test1', () => {
    const x1 = 23;
    const y1 = -78;
    const u = new RealNumberVector([x1, y1]);
    const v = new RealNumberVector([4, 5]);
    u.subtract(v);
    expect(u.elements[0]).toEqual(x1 - v.elements[0]);
    expect(u.elements[1]).toEqual(y1 - v.elements[1]);
  });

  it('Vector 2D multiply Test1', () => {
    const x1 = 14;
    const y1 = -58;
    const scalar = 4;
    const u = new RealNumberVector([x1, y1]);
    u.multiplyByScalar(scalar);
    expect(u.elements[0]).toEqual(x1 * scalar);
    expect(u.elements[1]).toEqual(y1 * scalar);
  });

  it('Vector 2D divide Test1', () => {
    const x1 = 13;
    const y1 = -57;
    const scalar = 7;
    const u = new RealNumberVector([x1, y1]);
    u.divideByScalar(scalar);
    expect(u.elements[0]).toEqual(x1 / scalar);
    expect(u.elements[1]).toEqual(y1 / scalar);
  });


  it('Vector 2D UnitVector test1', () => { 
    const x = 1;
    const y = 2;
    const v1 = new RealNumberVector([x, y]);
    const mag = v1.magnitude();
    v1.normalize();
    const expected = new RealNumberVector([x / mag, y / mag]);
    expect(v1.equals(expected)).toEqual(true);
  });

  it('Vector 2D Magnitude test1', () => {
    const v1 = new RealNumberVector([1, 2]);
    const mag = v1.magnitude();
    const expected = Math.sqrt(v1.elements[0] * v1.elements[0] + v1.elements[1] * v1.elements[1] );
    expect(mag).toEqual(expected);
  });

  it('3D Load data string', () =>
  {
    const inputDataLine: string = 'vn 0.5 0 0.866025 ';
    const vector: RealNumberVector = new RealNumberVector();
    vector.setFromDelimetedString(inputDataLine);
    expect(vector.elements[0]).toEqual(0.5);
    expect(vector.elements[1]).toEqual(0);
    expect(vector.elements[2]).toEqual(0.866025);
  });



    it('2D Load data string', () =>
  {
    const inputDataLine: string = 'vt 0.5 0 ';
    const vector: RealNumberVector = new RealNumberVector();
    vector.setFromDelimetedString(inputDataLine);

    console.log('2D Load data string, vector.elements[0] = ' + vector.elements[0] + ' vector.elements[1] = ' + vector.elements[1]);


    expect(vector.elements[0]).toEqual(0.5);
    expect(vector.elements[1]).toEqual(0);
  });