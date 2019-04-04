////***FREQUENCY ANALYSIS OF CHRONICLE ARTICLES USING RITA***////

var articleNames = ["BUILDING COMMUNITY OR BREEDING SOLITUDE? DUKE STUDENTS' THOUGHTS ON HOUSING REFORM", 
"CLICKBAIT", "MORE TENTS, LESS TROUBLE: A NEW ERA IN K-VILLE", 
"GRAD PROGRAM DIRECTOR STEPS DOWN AFTER WARNING STUDENTS NOT TO SPEAK CHINESE",
"WHO IS WILL YE? A CONVERSATION WITH DUKE'S 'MEME GUY'"];
var articles = [];
var lines;
var topKeys = [];
var topContextWords = [];
var randomX = [];
var randomY = [[170,160,90,100,200],[180,100,150,195,90],[180,170,100,150,95],[190,180,70,170,200],[120,100,190,170,80]];


//preload article text files
function preload() {
  housing = loadStrings('data/housing.txt');
  clickbait = loadStrings('data/clickbait.txt');
  walkup = loadStrings('data/walkup.txt');
  neely = loadStrings('data/neely.txt');
  willye = loadStrings('data/willye.txt');
  housingimg = loadImage('images/housing.PNG');  
  clickbaitimg = loadImage('images/clickbait.png');
  walkupimg = loadImage('images/walkup.PNG');
  neelyimg = loadImage('images/neely.PNG');
  willyeimg = loadImage('images/willye.PNG');


}

//set up canvas
function setup() {
  articles = [housing, clickbait, walkup, neely, willye];
  images = [housingimg, clickbaitimg,walkupimg, neelyimg,willyeimg];
  createCanvas(windowWidth, windowHeight*5); //make canvas scrollable length
  background(49,49,49);
  for (let a=0; a<5; a++){
    analyzeText(a);
  }
}

  
function draw(){
  background(49);
  for (let a=0; a<5; a++){ //for each preloaded article
    textFont('Courier New');
    textSize(40);
    textAlign(CENTER);
    noStroke();
    fill(255);
    rectMode(CENTER);
    textHeight = windowHeight*a; 
    keyWordHeight = textHeight + 200;  
    text(articleNames[a], width/2, textHeight+100, width-200, 90); //print article names as titles
    tint(70,250);
    image(images[a],0,textHeight+150,windowWidth,windowHeight-150);

    
  //draw topKeys
    for(let i=0; i<5; i++){
  //ellipses 
      if(i==0){
        xloc = width/2;
      }
      if(i==1){
        xloc = width/2+2*140;
      }
      if(i==3){
        xloc = width/2+3.5*140;
      }
      if(i==2){
        xloc = width/2-i*140;
      }
      if(i==4){
        xloc = width/2-3.5*140;
      }
      
      yloc = keyWordHeight+randomY[a][i];
      ellipseMode(CENTER);
      ellipseSize = map(topKeys[a][i][1],5,topKeys[a][0][1],80,200);
      let d = dist(mouseX, mouseY, xloc, yloc);
      if(d < ellipseSize/2){
        fill(200,50,60,);
      }
      else{
        fill(90);
      }
      keyWordEllipse = ellipse(xloc, yloc, ellipseSize, ellipseSize);
      
    //keyword text
      textSize(map(topKeys[a][i][1],5,topKeys[a][0][1],15,40));
      textFont('Courier New');
      fill(255);
      strokeWeight(1);
      text(topKeys[a][i][0], xloc, yloc);
    
    //print context words in order, size according to frequency
      if(d < ellipseSize/2){ //draw if mouse is over ellipse
          drawTopContextWords(topContextWords[a][i],a,i);
        }
       }
    }
  }

function analyzeText(a){
  lines = articles[a].join(" "); //call article by index, get rid of line breaks
 
  //arguments for rita concordance function  
    args = {    
      ignoreCase: true,
      ignoreStopWords: true,
      ignorePunctuation: true,
      //wordsToIgnore: ["a", "about", "above", "after", "again", "against", "ain", "all", "am", "an", "and", "any", "are", "aren", "aren't", "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "can", "couldn", "couldn't", "d", "did", "didn", "didn't", "do", "does", "doesn", "doesn't", "doing", "don", "don't", "down", "during", "each", "few", "for", "from", "further", "had", "hadn", "hadn't", "has", "hasn", "hasn't", "have", "haven", "haven't", "having", "he", "her", "here", "hers", "herself", "him", "himself", "his", "how", "i", "if", "in", "into", "is", "isn", "isn't", "it", "it's", "its", "itself", "just", "ll", "m", "ma", "me", "mightn", "mightn't", "more", "most", "mustn", "mustn't", "my", "myself", "needn", "needn't", "no", "nor", "not", "now", "o", "of", "off", "on", "once", "only", "or", "other", "our", "ours", "ourselves", "out", "over", "own", "re", "s", "same", "shan", "shan't", "she", "she's", "should", "should've", "shouldn", "shouldn't", "so", "some", "such", "t", "than", "that", "that'll", "the", "their", "theirs", "them", "themselves", "then", "there", "these", "they", "this", "those", "through", "to", "too", "under", "until", "up", "ve", "very", "was", "wasn", "wasn't", "we", "were", "weren", "weren't", "what", "when", "where", "which", "while", "who", "whom", "why", "will", "with", "won", "won't", "wouldn", "wouldn't", "y", "you", "you'd", "you'll", "you're", "you've", "your", "yours", "yourself", "yourselves", "could", "he'd", "he'll", "he's", "here's", "how's", "i'd", "i'll", "i'm", "i've", "let's", "ought", "she'd", "she'll", "that's", "there's", "they'd", "they'll", "they're", "they've", "we'd", "we'll", "we're", "we've", "what's", "when's", "where's", "who's", "why's", "would"]
     };
  
  //find top 5 key words in article
    bank = RiTa.concordance(lines,args); //concordance of words and frequency in entire article
    entries = Object.entries(bank); //convert to array of arrays
    entries.sort(function(a, b) { //sort words according to frequency
      return b[1] - a[1];
    });
    topKeys[a] = [];
    topKeys[a] = entries.slice(0,5); //get top 5 most frequent words
    topContextWords[a] = [];

  //get words found in context (same sentence) of each key word
    sentences = RiTa.splitSentences(lines); //tokenize article into sentences
    for (let i=0; i<5; i++){   //for each of 5 most frequent words
      topContextWords[a][i] = [];
      kwstring = new RiString("");
      for (let j=0; j<sentences.length; j++){   //search for topKey in each sentence in article
        if(sentences[j].indexOf(topKeys[a][i][0]) !== -1){
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

      for (k=1; k<contextWordsSorted.length; k++){ //add important words to array - noun, vb, adj, adv
        if (contextWordsSorted[k][0] != topKeys[i] && RiTa.isNoun(contextWordsSorted[k][0]) || RiTa.isVerb(contextWordsSorted[k][0]) ||RiTa.isAdjective(contextWordsSorted[k][0]) || RiTa.isAdverb(contextWordsSorted[k][0])){
          topContextWords[a][i].push(contextWordsSorted[k])
        }
      }
  }
}

//function to get key according to value
function getKey(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

// function drawTopKeys(thisKeyWord,a){
//   for(let i=0; i<5; i++){
//     //ellipses 
//       ellipseMode(CENTER);
//       fill(100);
//       //strokeWeight(1);
//       if(i==0){
//         xloc = width/2;
//       }
//       if(i==1){
//         xloc = width/2+2*120;
//       }
//       if(i==3){
//         xloc = width/2+3.5*120;
//       }
//       if(i==2){
//         xloc = width/2-i*120;
//       }
//       if(i==4){
//         xloc = width/2-3.5*120;
//       }
//       yloc = keyWordHeight+randomY[a][i];
//       ellipseSize = map(topKeys[a][i][1],5,topKeys[a][0][1],80,225);
//       keyWordEllipse = ellipse(xloc, yloc, ellipseSize, ellipseSize);

//     //keyword text
//       textSize(map(topKeys[a][i][1],5,topKeys[a][0][1],15,40));
//       textFont('Courier New');
//       fill(255);
//       strokeWeight(1);
//       text(topKeys[a][i][0], xloc, yloc);
//     }
// }

function drawTopContextWords(thisContextWord,a,i){
  for (l=0; l<11; l++){
    ellipseMode(CENTER);
    //fill(120,200);
    fill(255,210,150,100);
    noStroke();
    if (thisContextWord[l]!=topKeys[a][i]){
      xloc2 = xloc+((ellipseSize+100)/2*cos(l*(36)));
      yloc2 = yloc+((ellipseSize+100)/2*sin(l*(36)));
      ellipseSize2 = map(thisContextWord[l][1],1,thisContextWord[0][1],30,75); 
      textSize(map(thisContextWord[l][1],1,thisContextWord[0][1],15,20));
      ellipse(xloc2,yloc2,ellipseSize2,ellipseSize2);
      fill(255);
      noStroke();
      text(thisContextWord[l][0],xloc2,yloc2);
      //text(topContextWords[a][i][l][0],xloc,yloc+30+l*20);
      if (keyIsDown(13)){ //display word counts when enter key is held
        textSize(25);
        text(topKeys[a][i][1],xloc,yloc+25);
        textSize(18);
        text(topContextWords[a][i][l][1],xloc2,yloc2+20);
    }
    }
}
}
