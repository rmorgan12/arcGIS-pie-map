// DDX Bricks Wiki - See https://developer.domo.com/docs/ddx-bricks
// for tips on getting started, linking to Domo data and debugging your app
//console.log("Test 1")
//Available globals
var domo = window.domo;
var datasets = window.datasets;

//Step 1. Select your dataset(s) from the button in the bottom left corner



//Step 2. Query your dataset(s): https://developer.domo.com/docs/dev-studio-references/data-api
var fields = ['Latitude', 'Longitude', 'State', 'City', 'ND', 'HS', 'SC', 'B', 'G', 'Total'];
var query = `/data/v1/${datasets[0]}?fields=${fields.join()}`;
domo.get(query).then(handleResult);



//Step 3. Do something with the data from the query result
function handleResult(data){
  console && console.log(data);
  require([
        "esri/Map",
        "esri/views/MapView",
        "esri/layers/FeatureLayer",
    		"esri/core/promiseUtils",
        "esri/Graphic",
        "esri/geometry/Point",
        "esri/rest/locator",
        "esri/widgets/Legend",
        "esri/widgets/Expand"
      ], (Map, MapView, FeatureLayer, promiseUtils, Graphic, Point, locator, Legend, Expand) => {

    
       //const selectStateItem = {
          //title: "Select State",
          //id: "select-state",
          //image: "https://img.icons8.com/material-outlined/512/empty-filter.png"
        //};
    

        const template = {
          title: "{city}, {state}",
          content: [
            {
              type: "media",
              mediaInfos: [
                {
                  title: "{total} People",
                  type: "pie-chart",
                  value: {
                    fields: ["noDiploma", "highSchool", "someCollege", "graduate","bachelors"]
                  }
                }
              ]
            }
           ],
          //actions: [selectStateItem]
        };
    
    
    		const renderer = {
          type: "pie-chart",
         	holePercentage: 0.5,
         	size: 30,
         	attributes: [
          		{
                color: "#f03d3a",
                label: "No Diploma",
                field: "noDiploma"
              },
            	{
                color: "#f0a43a",
                label: "High School",
                field: "highSchool"
              },
            	{
                color: "#edf03a",
                label: "Some College",
                field: "someCollege"
              },
            	{
                color: "#a7f03a",
                label: "Bachelors",
                field: "bachelors"
              },
            	{
                color: "#3af05e",
                label: "Graduate",
                field: "graduate"
              }
          ],
          backgroundFillSymbol: { // polygon fill behind pie chart
              color: [127, 127, 127, 0.2],
              outline: {
                width: 1,
                color: [255, 255, 255, 0.3]
              }
            },
            outline: {
              width: 1.5,
              color: "grey"
            },
            visualVariables: [
              {
                type: "size",
                field:"total",
                minDataValue: 0,
                maxDataValue: 1500,
                minSize: 12,
                maxSize: 48
              }
            ],
        };
    
      	const graphics = dataToGraphics(data);
    		console.log("GRAPHICS");
    		console.log(graphics);
    
    
      	const layer = createLayer(graphics, template, renderer);
    		console.log("LAYER");
    		console.log(layer); 
    
      	const view = new MapView({
          map: new Map({
            basemap:"dark-gray-vector",
            layers:[layer]
          }),
          container: "viewDiv",
          center: [-73.999593, 40.722486],
        	scale:7222233,
        	popup: {
            dockEnabled: true,
            dockOptions: {
              position: "top-right",
              breakpoint: false
            }
          }
        });
    
        view.ui.add(
          new Legend({
            view: view
          }),
          "bottom-left"
        );
    
				//view.popup.on("trigger-action", (event) => {
        	//if (event.action.id === "select-state") {
          	//selectState();
        	//}
      	//});
    
    
    
    
    
    
    
    	function dataToGraphics(data) {
        const graphics = data.map((row) => {
          // location: object that maps lat + long
          const location = new Point({
            latitude: row["Latitude"],
            longitude: row["Longitude"]
          });
          
          return new Graphic({
            geometry: location,
            attributes: {
              city: row["City"],
              state: row["State"],
              noDiploma: row["ND"],
              highSchool: row["HS"],
              someCollege: row["SC"],
              graduate: row["G"],
              bachelors: row["B"],
              total: row["Total"]
              //grabs each row of the specified columns and renames them
            }
          });
        });
        return graphics;
      };
              
                     
			function createLayer (graphics, template, renderer){
          return new FeatureLayer({
            source: graphics,
            objectIdField: "OBJECTID",
            fields: [
              {
                name: "city",
                type: "string"
              },
              {
                name: "noDiploma",
                type: "integer"
              },
              {
                name: "highSchool",
                type: "integer"
              },
              {
                name: "someCollege",
                type: "integer"
              },
              {
                name: "bachelors",
                type: "integer"
              },
              {
                name: "graduate",
                type: "integer"
              },
              {
                name: "total",
                type: "integer"
              },
              {
                name: "state",
                type: "string"
              }
              
            ],
            renderer: renderer,
            popupTemplate: template
          });
        }
    
				function addToView(layer){
          view.map.add(layer);
        }
    
				//function selectState(){
          //console.log("Filter by State");
          //const selectedFeature = view.popup.selectedFeature;
          //const selectedState = selectedFeature.attributes.state;
          
          //domo.filterContainer([{
            //column: 'state',
            //operator: 'IN',
            //values: [selectedState],
            //dataType: 'STRING'
          //}]);

          
        //}
      });    
    
}
