import { RealNumberVector } from "./RealNumberVector";

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