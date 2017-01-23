function DataObject (name, value)
{
	this.name = name;
	this.value = value;
}

var graphGenerator = {

	browserProperties: {

		changeURL: function (name) {

			window.document.title = name;
		},

		initializeColorArray: function() {

			var colors = graphGenerator.graphFunction.generator.constants.colors;
			graphGenerator.graphFunction.generator.constants.colors.colorArray = new Array(
				colors.purple, colors.red, colors.orange, colors.yellow, colors.green,
				colors.blue, colors.brown, colors.violet, colors.black, colors.white,
				colors.pink, colors.cyan, colors.navy, colors.peach, colors.yellowGreen,
				colors.skyBlue);
		},

		startUp: function() {

			graphGenerator.browserProperties.initializeColorArray();
			graphGenerator.browserProperties.changeURL("Graph Generator");
			graphGenerator.inputFunction.clearEverything();
			get_e('titleAdder').value = "";
			get_e('rangeAdder').value = "";
			get_e('showSubTitleOption').checked = false;
			get_e('showSubTitleOption').onclick = 
				graphGenerator.browserProperties.hideLabel;
			graphGenerator.browserProperties.hideLabel();
			get_e('graphType').selectedIndex = 1;
			get_e('valueAdder').onkeypress = 
				graphGenerator.inputFunction.sendLayout;
			get_e('nameAdder').onkeypress = 
				graphGenerator.inputFunction.switchLayout;
			get_e('titleAdder').onkeypress = 
				graphGenerator.inputFunction.sendMeta;
			get_e('rangeAdder').onkeypress =
				graphGenerator.inputFunction.sendMetaNum;
			get_e('addButton').onclick = 
				graphGenerator.graphFunction.classExplorer.addNewData;
			get_e('clearButton').onclick =
				graphGenerator.inputFunction.clearEverything;
			get_e('submitButton').onclick =
				graphGenerator.graphFunction.variables.applyGraphMeta;
			graphGenerator.graphFunction.generator.draw();
			EventHandler.resizeEvent.attachFunction("Force_Redraw_Ontime", 
				graphGenerator.graphFunction.generator.singleInstanceRedraw);

			

		},

		hideLabel: function() {

			graphGenerator.graphFunction.variables.showSubTitleOption 
											= get_e('showSubTitleOption').checked;

			if (get_e('showSubTitleOption').checked) {

				get_e('graphSubTitleAdder').style.display = "inline";
				get_e('graphSubTitleAdder').value = "";

			}
			else {

				get_e('graphSubTitleAdder').style.display = "none";
				get_e('graphSubTitleAdder').value = "";
			}
		}
	},

	graphFunction: {

		variables: {

			data: new Array(),
			graphTitle: "",
			graphType: 1,
			graphRange: 0,
			graphSubTitle: "",
			showSubTitleOption: false,
			newWindow: null,

			temporary: {

			},

			applyGraphMeta: function () {

				graphGenerator.graphFunction.variables.graphTitle = get_e("titleAdder").value;
				graphGenerator.graphFunction.variables.graphSubTitle = 
					get_e("graphSubTitleAdder").value;

				graphGenerator.graphFunction.variables.graphRange = 
						parseInt(get_e("rangeAdder").value);

				var selectBox = get_e("graphType");
				graphGenerator.graphFunction.variables.graphType  = 
						selectBox[selectBox.selectedIndex].value;
			},

			addData: function (name, value) {

				if (isNaN(value) || isEmpty(value)) {

					throw "Not a number exception occured";
				}

				var _data = new DataObject(name, parseInt(value));
				graphGenerator.graphFunction.variables.data.push(_data);
				graphGenerator.graphFunction.classExplorer.updateDataSource();
				graphGenerator.graphFunction.generator.data.randomize = true;
			},

			removeData: function(index) {

				try {

					graphGenerator.graphFunction.variables.data.splice(index, 1);
					graphGenerator.graphFunction.generator.data.listArray.splice(index, 1);
					graphGenerator.graphFunction.classExplorer.updateDataSource();
					graphGenerator.graphFunction.generator.data.randomize = true;
				}
				catch (exception) {

					//alert(exception);
				}
			},

			editData: function(index) {

				try {


					var width = window.screen.width;
					var height = window.screen.height;
					var dataSource = graphGenerator.graphFunction.variables.data;
					if (graphGenerator.graphFunction.variables.newWindow != null) {

						graphGenerator.graphFunction.variables.newWindow.close();
					}

					graphGenerator.graphFunction.variables.newWindow = 
							window.open("edit.html", "",
								"height=150, width=300, resizable=no, scrollbar=yes,"   + 
								"top=" + ((height / 2) - 150) + "," +
								"left=" + ((width/2) - 200) + "");

					var newWindow = graphGenerator.graphFunction.variables.newWindow;
					newWindow.dataName = dataSource[index].name;
					newWindow.dataVal  = dataSource[index].value;
					graphGenerator.graphFunction.variables.temporary.selectedIndex = index;
				}
				catch (exception) {

					alert(exception);
				}
			},

			applyEdit: function (index, name, value) {

				var _data = new DataObject(name, parseInt(value));
				graphGenerator.graphFunction.variables.data.splice(index, 1, _data);
				graphGenerator.graphFunction.classExplorer.updateDataSource();
				graphGenerator.graphFunction.variables.newWindow.close();
			}
		},

		classExplorer: {

			addNewData: function () {

				try {

					var name = get_e('nameAdder').value;
					var value = get_e('valueAdder').value;

					graphGenerator.inputFunction.clearEverything();
					graphGenerator.graphFunction.variables.addData(name, value);
				}
				catch (exception) {

					
				}
					
			},

			updateDataSource: function () {

				var dataSource = graphGenerator.graphFunction.variables.data;
				var innerhtml  =	'<tr>'						 +
										'<th>Name</th>'          +
										'<th>Value</th>'		 +
										'<th>Commands</th>'      +
									'</tr>';

				if (dataSource.length <= 0 ) {

					innerhtml += "<td colspan=3>No Data...</td>"
				}
				for (var i = 0; i < dataSource.length; i++) {

					innerhtml += '<tr>' +
									'<td>' + dataSource[i].name + '</td>' 	   +
									'<td>' + dataSource[i].value + '</td>' 	   + 
									'<td>' 									   + 
							'<div class="submitButton explorerSub"'			   +
								'onclick='									   +
			'"graphGenerator.graphFunction.variables.editData('+i+')"' 		   +
								'>Edit</div>' 								   +
							'<div class="submitButton explorerSub"' 		   + 
								'onclick=' 									   + 
			'"graphGenerator.graphFunction.variables.removeData('+i+')"'  	   +
							'>Remove</div>' 								   + 
							'</td>' 										   + 
								 '</tr>';
				}


				get_e('classExplorerContainer').innerHTML = 
					"<table class='classExplorer'>" + innerhtml + "</table>";
			}
		},

		generator: {

			timeoutDraw: null,
			constants: {

				colors: {

					purple: "rgba(181, 99, 175, 1)",
					red   : "rgba(253,  33,  86,  1)",
					orange: "rgba(215,  123,  44,  1)",
					yellow: "rgba(249,  251,  11,  1)",
					green:  "rgba(88,  253,  11,  1)",
					blue:   "rgba(37,  119,  245, 1)",
					brown: 	"rgba(72,  33,  16, 1)",
					violet: "rgba(72,  33,  136, 1)",
					black: 	"rgba(3,  6,  10,  1)",
					white: 	"rgba(222,  230,  230, 1)",
					pink: 	"rgba(216,  185,  226,  1)",
					cyan: 	"rgba(146,  230,  230, 1)",
					navy: 	"rgba(43,  64,  56,  1)",
					peach: 	"rgba(216,  185,  179,  1)",

					//Extra Colors

					yellowGreen: "rgba(173,  220,  56,  1)",
					skyBlue: 	 "rgba(29,  210,  251,  1)",
					colorArray:  null

				}
			},

			data: {

				listArray :  null,
				randomize :  true
			},

			draw: function(singleInstance) {

				singleInstance = singleInstance || false;

				var width  	= get_e("graphSection").offsetWidth;
				var height 	= get_e("graphSection").offsetHeight;
				var canvas	= get_e("graphDrawSection");
				var context = canvas.getContext("2d");
				var graphType  = graphGenerator.graphFunction.variables.graphType;
				var graphTitle = graphGenerator.graphFunction.variables.graphTitle;
				var dataSource = graphGenerator.graphFunction.variables.data;
				var colorArray = graphGenerator.graphFunction.generator.constants.colors.colorArray;
				var colorNameSpace = graphGenerator.graphFunction.generator.constants.colors;

				canvas.height = height;
				canvas.width  = width + (width * 0.25);
				context.clearRect(0, 0, width, height);

				this.drawFunctions.listTally(canvas, colorArray, colorNameSpace);
				this.drawFunctions.drawGraph(canvas, graphType);
				this.drawFunctions.writeTitle(canvas, graphTitle, graphType);
				this.drawFunctions.designGuide(canvas);

				if (!singleInstance) {

					graphGenerator.graphFunction.generator.timeoutDraw = 
						setTimeout("graphGenerator.graphFunction.generator.draw(false)", 16);
				}

			},

			drawFunctions: {

				getMouseCoord: function (canvas, message) {

				},

				listTally: function(canvas, colorArray, colors) {

					var context = canvas.getContext("2d");
					var ySpace  = 40;
					var count   = 1;

					if (graphGenerator.graphFunction.generator.data.randomize) {

						/*
						 * Generate a persistent list of random unique numbers for the listArray 
						 * variable base on the length of the colorArray variable.
						 *
						 * The purpose of this is to pair each data with a unique colour. 
						 * This unique pairing algorithm ONLY OCCURS when the number of unique colour
						 * the graph generator knows is greater than the number of data the graph
						 * generator holds. If ever this condition is false, then the unique pairing
						 * will no longer happen
						 */

						if (graphGenerator.graphFunction.generator.data.listArray == null) {

							graphGenerator.graphFunction.generator.data.listArray = new Array();
						}

						var arrayRand = new Array();
						var colorLength =  
						graphGenerator.graphFunction.generator.constants.colors.colorArray.length;
						var lengthVal = graphGenerator.graphFunction.variables.data.length;
						var listArrLen= graphGenerator.graphFunction.generator.data.listArray.length;
						var randUniqIndx;
						var randUniqNumb;

						for (var i = 0; i < colorLength; i++) {

							arrayRand[i] = (i);
						}

						if (lengthVal <= colorLength) {

							for (var i = 0; i < listArrLen; i++) {

								for (var j = 0; j < arrayRand.length; j++) {

									if (arrayRand[j] == 
										graphGenerator.graphFunction.generator.data.listArray[i]) {

										var lastval = arrayRand[j];
										arrayRand.splice(j, 1);
									}
								}
							}
						}
						
						for (var i = 0; i < lengthVal; i++) {

							randUniqIndx = Math.floor(Math.random() * arrayRand.length);
							randUniqNumb = arrayRand[randUniqIndx];

							if (typeof graphGenerator.graphFunction.generator.data.listArray[i] === 
								'undefined') {
							graphGenerator.graphFunction.generator.data.listArray.push(randUniqNumb);
							arrayRand.splice(randUniqIndx, 1);
							}
						}

						graphGenerator.graphFunction.generator.data.randomize = false;
					}


					
				},

				drawGraph: function (canvas, type) {

					var context = canvas.getContext("2d");
					type = parseInt(type);
					switch (type) {

						case 0:
							this.drawLineGraph(canvas);
							break;
						case 1:
							this.drawBarGraph(canvas);
							break;
						case 2:
							this.drawPieGraph(canvas);
							break;
						default:
							break;
					}

				},

				drawLineGraph: 	function (canvas) {

				},

				drawBarGraph: 	function (canvas) {

					var context = canvas.getContext("2d");
					var arrayDex= graphGenerator.graphFunction.generator.data.listArray;
					var arrayDat= graphGenerator.graphFunction.variables.data;
					var colorArr= graphGenerator.graphFunction.generator.constants.colors.colorArray
					var colors  = graphGenerator.graphFunction.generator.constants.colors;

					// Tally Form

					var yCount = 50;
					var xCount = 0;
					var name   = "";
					var highestVal = 0;


					for (var i = 0; i < arrayDat.length; i++) {

						name = arrayDat[i].name;
						if (name.length > 8) {

							name = name.substring(0, 5) + "...";
						}

						if (yCount > canvas.height - 30) {

							yCount = 50;
							xCount += 100;
						}

						context.shadowColor = "rgba(0, 0, 0, .3)";
						context.shadowBlur  = 8;
						context.shadowOffsetX = 1;
						context.shadowOffsetY = 1;
						context.beginPath();
						context.font 		  = "bold 12pt Arial";
						context.fillStyle     = colorArr[arrayDex[i]];
						context.rect(xCount + 20, yCount, 15, 15);
						context.fillRect(xCount + 20, yCount, 15, 15);
						context.fillStyle     = colors.black;	
						context.fillText(name, xCount + 40, yCount + 12.5);
						context.lineWidth     = 1;
						context.strokeStyle   = colors.black;
						context.stroke();

						if (highestVal < parseInt(arrayDat[i].value)) {

							highestVal = parseInt(arrayDat[i].value);
						}

						yCount += 30;
					}

					// <--- Ends here
					// Graph Interface

					var startPos = xCount + 280;

					if (arrayDat.length > 0) {

					context.beginPath();
					context.moveTo(startPos - 30, 80);
					context.lineTo(startPos - 30, canvas.height - 85);
					context.stroke();

					context.beginPath();
					context.moveTo(startPos - 30, canvas.height - 85);
					context.lineTo(canvas.width - 30, canvas.height - 85);
					context.stroke();

					var diffVal = (canvas.height - 85) - 80;
					var yStarts = canvas.height - 85;
					diffVal = diffVal / 10;
					console.log(diffVal);

					var ValSplit = highestVal / 10;
					var arrayDim = new Array();

					for (var i = 0; i < 11; i++) {

						context.shadowColor = "rgba(0, 0, 0, 0)";
						context.shadowBlur  = 8;
						context.shadowOffsetX = 1;
						context.shadowOffsetY = 1;
						context.beginPath();
						context.arc(startPos - 30, yStarts,3,0,2*Math.PI);
						context.fill();

						var strVal = parseInt(ValSplit * i);
						var dimensionText = context.measureText(strVal);
						context.fillText(parseInt(ValSplit * i), 
						((startPos + 80) / 2) - (dimensionText.width / 2), yStarts + 5);

						if (i != 0) {

							context.beginPath();
							context.moveTo(startPos - 40, yStarts);
							context.lineTo(startPos - 30, yStarts);
							context.stroke();
						}

						arrayDim.push(yStarts);
						yStarts -= diffVal;
					}}

					startPos += 30;

					for (var i = 0; i < arrayDat.length; i++) {

						name = arrayDat[i].name;
						if (name.length > 8) {

							name = name.substring(0, 5) + "...";
						}

						context.shadowColor = "rgba(0, 0, 0, .3)";
						context.shadowBlur  = 8;
						context.shadowOffsetX = 1;
						context.shadowOffsetY = 1;

						context.font 		  = "14pt Arial";
						context.fillText(name, startPos, canvas.height - 25);
						//context.fillRect(xCount + 20, yCount, 15, 15);

						context.shadowColor = "rgba(0, 0, 0, 0)";
						context.shadowBlur  = 8;
						context.shadowOffsetX = 1;
						context.shadowOffsetY = 1;



						startPos += 130;
					}

				},

				drawPieGraph: 	function (canvas) {

				},

				writeTitle: function(canvas, title, type) {

					if (isEmpty(title)) {

						title = "Untitled Graph";
					}

					type        = parseInt(type);
					var context = canvas.getContext("2d");
					var height  = canvas.height;
					var width   = canvas.width;
					var hideSub = graphGenerator.graphFunction.variables.showSubTitleOption;
					var subName = graphGenerator.graphFunction.variables.graphSubTitle;
					var grphEqv = null;
					var textSz  = null;
					var textPos = null;
					var charSz  = null;
					var string  = "";

					context.lineWidth = 3;
					context.shadowColor = "rgba(0, 0, 0, .5)";
					context.shadowBlur  = 8;
					context.shadowOffsetX = 1;
					context.shadowOffsetY = 1;	
					context.fillStyle = "black";
					context.font = "24pt Arial";

					textSz  = context.measureText(title);
					textPos = (width / 2) - (textSz.width / 2) ;
					context.fillText(title, textPos, 34);	

					switch (type) {

						case 0:
							grphEqv = "Line";
							break;
						case 1:
							grphEqv = "Bar";
							break;
						case 2:
							grphEqv = "Pie";
							break;
						default:
							grphEqv = "Undefined";
							break;
					}

					if (hideSub) {

						string = subName;
					}
					else {

						string = grphEqv + " graph";
					}

					context.shadowColor = "rgba(0, 0, 0, 0)";
					context.font = "12pt Arial";
					textSz  = context.measureText(string);	
					textPos = (width / 2) - (textSz.width / 2) ;
					context.fillText(string, textPos, 58);

				},

				// Draws a red circle in the center of the canvas
				designGuide: function(canvas) {

					var context = canvas.getContext("2d");
					var centerX = canvas.width / 2;
      				var centerY = canvas.height / 2;

      				var radius = 3;

				      context.beginPath();
				      context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
				      context.fillStyle = 'red';
				      context.fill();
				}
			},

			singleInstanceRedraw: function() {

				graphGenerator.graphFunction.generator.draw(true);
			}
		}
	},

	inputFunction: {

		clearEverything: function() {

			get_e('nameAdder').value = "";
			get_e('valueAdder').value = "";
		},

		switchLayout: function (e) {

			e = e || event;
			

 			if (e.keyCode === 13) {

 				get_e('valueAdder').focus();
 			}
		},

		sendMeta: function (e) {

			e = e || event;

 			if (e.keyCode === 13) {

 				graphGenerator.graphFunction.variables.applyGraphMeta();
 			}
		},

		sendMetaNum: function (e) {

			e = e || event;

 			if (((e.charCode <= 47 || e.charCode >= 58)) &&
 				e.keyCode != 8) {

 				if (e.preventDefault) {
					e.preventDefault();
				} else {
					e.returnValue = false;
				}
 			}

 			if (e.keyCode === 13) {

 				graphGenerator.graphFunction.variables.applyGraphMeta();
 			}
		},

		standardKeyPress: function(e) {

			e = e || event;

 			if (e.keyCode === 13) {

 				
 			}
		},

		sendLayout: function(e) {

			e = e || event;

 			if (((e.charCode <= 47 || e.charCode >= 58)) &&
 				e.keyCode != 8) {

 				if (e.preventDefault) {
					e.preventDefault();
				} else {
					e.returnValue = false;
				}
 			}

 			if (e.keyCode === 13) {

 				graphGenerator.graphFunction.classExplorer.addNewData();
 			}
		},

		numericOnlyKeyPress: function(e) {

 			e = e || event;

 			if (((e.charCode <= 47 || e.charCode >= 58)) &&
 				e.keyCode != 8) {

 				if (e.preventDefault) {
					e.preventDefault();
				} else {
					e.returnValue = false;
				}
 			}

 			if (e.keyCode === 13) {


 			}
		}
	}
}

DomReady.ready(graphGenerator.browserProperties.startUp);
