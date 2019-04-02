////***FREQUENCY ANALYSIS OF CHRONICLE ARTICLES USING RITA***////

var articleNames = ["BUILDING COMMUNITY OR BREEDING SOLITUDE? DUKE STUDENTS' THOUGHTS ON HOUSING REFORM", 
"CLICKBAIT", "MORE TENTS, LESS TROUBLE: A NEW ERA IN K-VILLE", 
"GRAD PROGRAM DIRECTOR STEPS DOWN AFTER WARNING STUDENTS NOT TO SPEAK CHINESE",
"WHO IS WILL YE? A CONVERSATION WITH DUKE'S 'MEME GUY'"];
var articles = [];


//preload article text files
function preload() {
  housing = loadStrings('data/housing.txt');
  clickbait = loadStrings('data/clickbait.txt');
  walkup = loadStrings('data/walkup.txt');
  neely = loadStrings('data/neely.txt');
  willye = loadStrings('data/willye.txt');
  //clickbaitimg = loadImage('images/clickbait.png');
}


//set up canvas
function setup() {
  articles = [housing, clickbait, walkup, neely, willye];
  createCanvas(windowWidth, windowHeight*5); //make canvas scrollable length
  background(49,49,49);
  //image(clickbaitimg,0,0);
  ellipseColor = color(100,100,100);
}

function draw(){
  overEllipse = false;
  
for (let a=0; a<5; a++){
  textHeight = windowHeight*a; //
  lines = articles[a].join(" "); //call article by index, get rid of line breaks
  fill(255);
  textFont('Courier New');
  textSize(40);
  textAlign(CENTER);
  noStroke();
  rectMode(CENTER);
  text(articleNames[a], width/2, textHeight+100, width-200, 90);
  console.log(articleNames[a]);
  keyWordHeight = textHeight + 200;
  noLoop();


//arguments for rita concordance function  
  args = {    
    ignoreCase: true,
    ignoreStopWords: true,
    ignorePunctuation: true
   };

//find top 5 key words in article
  bank = RiTa.concordance(lines,args); //concordance of words and frequency in entire article
  entries = Object.entries(bank); //convert to array of arrays

  entries.sort(function(a, b) { //sort words according to frequency
    return b[1] - a[1];
  });
  topKeys = entries.slice(0,5); //get top 5 most frequent words

//get words found in context (same sentence) of each key word
  sentences = RiTa.splitSentences(lines); //tokenize article into sentences
  for (let i=0; i<5; i++){   //for each of 5 most frequent words
    kwstring = new RiString("");
    for (let j=0; j<sentences.length; j++){   //search for topKey in each sentence in article
      if(sentences[j].indexOf(topKeys[i][0]) !== -1){
        sentences[j] = new RiString(sentences[j]);
        sentences[j] = sentences[j].toLowerCase();
        kwstring = kwstring.concat(sentences[j]); //add sentences containing topKey to long key word string
        kwstring = kwstring.concat(" ");
        kwstring = RiTa.stripPunctuation(kwstring);
      }
    }

  //sort and filter context words by frequency and importance   
    kwbank = RiTa.concordance(kwstring,args); //concordance of words and frequency in long string of sentences containing topKey
    contextWordsSorted = (Object.entries(kwbank)).sort(function(a, b) {   //sort words according to frequency
      return b[1] - a[1];
    });
    topContextWords = [];
    for (k=1; k<contextWordsSorted.length; k++){ //add important words to array - noun, vb, adj, adv
      if (contextWordsSorted[k][0] != topKeys[i] && RiTa.isNoun(contextWordsSorted[k][0]) || RiTa.isVerb(contextWordsSorted[k][0]) ||RiTa.isAdjective(contextWordsSorted[k][0]) || RiTa.isAdverb(contextWordsSorted[k][0])){
        topContextWords.push(contextWordsSorted[k])
      }
    }

  //ellipse 
    ellipseMode(CENTER);
    fill(ellipseColor);
    stroke(255);
    strokeWeight(1);
    if(i%2==0){
      xloc = random(width/2-(i*100),width/2-(i*105));
    }
    else{
      xloc = random(width/2+(i*180),width/2+(i*180));
    }
    yloc = random(keyWordHeight+50, keyWordHeight+200);
    ellipseSize = map(topKeys[i][1],5,topKeys[0][1],80,225);
    keyWordEllipse = ellipse(xloc, yloc, ellipseSize, ellipseSize);
  
  //keyword text
    textSize(map(topKeys[i][1],5,topKeys[0][1],15,40));
    textFont('Courier New');
    fill(255);
    strokeWeight(1);
    text(topKeys[i][0], xloc, yloc);
    
    // let d = dist(mouseX, mouseY, xloc, yloc);
    // if(d < ellipseSize){
    //print context words in order, size according to frequency
      for (l=0; l<11; l++){
        ellipseMode(CENTER);
        fill(ellipseColor);
        fill(70,150);
        stroke(255);
        strokeWeight(1);
        if (topContextWords[l]!=topKeys[i]){
            xloc2 = xloc+((ellipseSize+100)/2*cos(l*(36)));
            yloc2 = yloc+((ellipseSize+100)/2*sin(l*(36)));
            ellipseSize2 = map(topContextWords[l][1],1,topContextWords[0][1],50,75); 
            textSize(10+topContextWords[l][1]);
          // else{
          //   xloc2 = xloc+((ellipseSize+50)/2*cos(l*(36)));
          //   yloc2 = yloc+((ellipseSize+50)/2*sin(l*(36)));
          //   ellipseSize2 = map(topContextWords[l][1],1,topContextWords[0][1],25,50);
          // }
        
          //ellipse(xloc2,yloc2,ellipseSize2,ellipseSize2);
          //text(topContextWords[l][0],xloc2,yloc2);
          fill(255);
          noStroke();
          text(topContextWords[l][0],xloc,yloc+30+l*20);
      // }
    }
    }
    }
    }
}



//function to get key according to value
function getKey(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}


function drawTopKeys(xloc,yloc){
  for (let i=0; i<5; i++){  
    ellipse(100+((width/5)*i), keyWordHeight,80,80);
    text(topKeys[i][0], 100+((width/5)*i), keyWordHeight); 
  }
}

function mouseOver(){
  if (ellipse.mouseOver){
    loop();
  }

}
//     // Test if the cursor is over the box
//     if (
//       mouseX > xloc - ellipseSize/2 &&
//       mouseX < xloc + ellipseSize &&
//       mouseY > yloc - ellipseSize &&
//       mouseY < yloc + ellipseSize
//     ) {
//       overEllipse = true;
//     } else {
//       overEllipse = false;
//     }
// }





