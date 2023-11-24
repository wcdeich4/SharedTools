/// <reference lib="webworker" />
import { ColorHelper } from "../helpers/ColorHelper";
import { ComplexPoint } from "../math/ComplexPoint";
import { Pixel } from "./Pixel";
//import { ScreenRangeConverter2D } from "../math/ScreenRangeConverter2D";
import { ScreenRangeWithDataFocusArea } from "../math/ScreenRangeWithDataFocusArea";

let mandelbrotRange: ScreenRangeWithDataFocusArea = null;
const pixel: Pixel = new Pixel(); 
const complexCoordinate: ComplexPoint = new ComplexPoint(0, 0);
const Zn: ComplexPoint = new ComplexPoint(0, 0);;
let n: number = 0;
const iterationLimit = 80; //TODO: put in .ini or .json file

addEventListener('message', ({ data }) => {


    console.log('Mandelbrot.WebWorker received json: ' + data);

    mandelbrotRange = JSON.parse(data,function reviver(key, value){
        if(typeof value==='object')
        {
            return Object.assign(new ScreenRangeWithDataFocusArea, value);
        }
        else
        {
            return value;
        }
    }) as ScreenRangeWithDataFocusArea;

    // console.log('Mandelbrot.WebWorker.ts received message string:  ');
    // console.log(data);


    if (mandelbrotRange == null)
    {
        console.log('mandelbrotRange = JSON.parse(data) as ScreenRangeConverter2D returned null in Mandelbrot.WebWorker '  );
    }
    else
    {
/*
//this.yAspectRatio = height / this.yRange() ;
//this.xAspectRatio = width / this.xRange() ;

this.mostRecentCoordinate2D.x = x / this.xAspectRatio - Math.abs(this.xMin);
this.mostRecentCoordinate2D.y = Math.abs(this.yMin) - y / this.yAspectRatio  ;
*/

let deltaX = mandelbrotRange.getScreenDeltaX();
let deltaY = mandelbrotRange.getScreenDeltaY();

let worldX = mandelbrotRange.dataEvaluationRange.xMin ;
pixel.x = mandelbrotRange.world2DXtoCanvasX(  worldX );
const endX = mandelbrotRange.world2DXtoCanvasX( mandelbrotRange.dataEvaluationRange.xMax );

const highY = mandelbrotRange.world2DYtoCanvasY( mandelbrotRange.dataEvaluationRange.yMax );
const lowY  = mandelbrotRange.world2DYtoCanvasY( mandelbrotRange.dataEvaluationRange.yMin );



//let worldX = mandelbrotRange.xMin;
//pixel.x = 0; //oh wait, we need more info in addition to ScreenRangeConverter2D, not less..... hack mostRecentCoordinate2D?  Would have to alter conciseJSON()......... and reviver function..........
//while( worldX <=  mandelbrotRange.xMax )
while( pixel.x <  endX)
{
    let worldY = mandelbrotRange.yMax;
    pixel.y = highY;
    //while( worldY <= mandelbrotRange.yMax )
    while( pixel.y <= lowY)
    {
        // pixel.color = 'green';
        // pixel.x = canvasX;
        // pixel.y = canvasY;
        // postMessage(JSON.stringify(pixel));
        complexCoordinate.set(worldX, worldY);
        Zn.set(worldX, worldY);
        for (n = 1; n < iterationLimit; n++)
        {
            Zn.square();
            Zn.add(complexCoordinate);
            if (Zn.magnitudeSquared() > 4)
            {
                break;
            }
        }
    
       // pixel.x = currentCoordinate2D.x;  //create set method?  Or cast as child object?
       // pixel.y = currentCoordinate2D.y;
    
        if (n >= iterationLimit)
        {
            pixel.color = 'black';
        }
        else
        {
            pixel.color = ColorHelper.FastFullySaturatedHueToHex(n / iterationLimit);
        }
        
   // console.log('color: ' + pixel.color);
   //     postMessage(JSON.stringify({ dot: pixel}));
   postMessage(JSON.stringify(pixel));


        worldY -= deltaY;
        pixel.y++;
    }
    worldX += deltaX;
    pixel.x ++;
}


        //https://stackoverflow.com/questions/50934243/function-in-object-become-not-a-function-after-json-parse
        //see answer with 4 likes
        /* EX
        var correctUser=JSON.parse(json,function(key,value){
        if(typeof value==='object')
            return Object.assign(new UserObject,vPixelalue);
        return value;
        });
        */
        //https://www.w3schools.com/js/js_json_parse.asp
       // let p: Point2D = mandelbrotRange.canvasToWorld2DCoordinates(0,0);



       // console.log('mostRecentCoordinate2D.x = ' + p.x);
        //console.log('width ' + rectangularLimits.width + ' height ' + rectangularLimits.height);

        // postMessage(JSON.stringify(p));

        
        // let world2DCoordinates: Coordinate2D = null;
        // for (let w = 0; w < rectangularLimits.width ; w++)
        // {
        //     for (let h = 0; h < rectangularLimits.height; h++) 
        //     {
        //        // world2DCoordinates = mathCanvas.canvasToWorld2DCoordinates(w, h);

        //      ////   this.worker.postMessage( JSON.stringify( world2DCoordinates  ) );

        //     }
        // }
        

    }


/*

    try
    {
        currentCoordinate2D = JSON.parse(data) as Coordinate2D;
        if (currentCoordinate2D == null)
        {
            console.log('currentCoordinate2D == null');
        }
        else
        {
            complexCoordinate.setFromCoordinate(currentCoordinate2D);



        Zn = complexCoordinate.clone() as ComplexPoint;
        for (n = 1; n < iterationLimit; n++)
        {
            Zn.square();
            Zn.add(complexCoordinate);
            if (Zn.magnitudeSquared() > 4)
            {
                break;
            }
        }
    
        pixel.x = currentCoordinate2D.x;  //create set method?  Or cast as child object?
        pixel.y = currentCoordinate2D.y;
    
        if (n >= iterationLimit)
        {
            pixel.color = 'black';
        }
        else
        {
            pixel.color = ColorHelper.HSLToHex(n / iterationLimit);
        }
        
    console.log('color: ' + pixel.color);
        postMessage(JSON.stringify({ dot: pixel}));





        }
    }
    catch (e)
    {
        
    }
    

/*


   // console.log('mandelbrot worker received message: ' + data);
    let parsedData = JSON.parse(data);
    if (parsedData.coordinate == null)
    {
        console.log('parsedData.coordinate == null');
    }
    else
    {
 //   console.log('parsedData.coordinate = ' + parsedData.coordinate);
    // mathCanvas.drawPixelWorld2DCoordinates(parsedData.dot, '#00FF00');

    //https://stackoverflow.com/questions/34031448/typescript-typeerror-myclass-myfunction-is-not-a-function
    complexCoordinate = parsedData.coordinate as ComplexPoint;
    // if (complexCoordinate == null )
    // {
    //     console.log('complexCoordinate == null ');
    // }
    // else
    if (complexCoordinate instanceof ComplexPoint) 
    {

        Zn = complexCoordinate.clone() as ComplexPoint;
        for (n = 1; n < iterationLimit; n++)
        {
            Zn.square();
            Zn.add(complexCoordinate);
            if (Zn.magnitudeSquared() > 4)
            {
                break;
            }
        }
    
        pixel.x = complexCoordinate.realPart;
        pixel.y = complexCoordinate.imaginaryPart;
    
        if (n >= iterationLimit)
        {
            pixel.color = 'black';
        }
        else
        {
            pixel.color = ColorHelper.HSLToHex(n / iterationLimit);
        }
        
    console.log('color: ' + pixel.color);
        postMessage(JSON.stringify({ dot: pixel}));
    }
    else
    {
        console.log('! complexCoordinate instanceof ComplexPoint');
    }



    }

    */





    });