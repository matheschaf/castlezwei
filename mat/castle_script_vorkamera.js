function debu(inp){console.log(inp);}

var canvas = document.getElementById("renderCanvas");
var startRenderLoop = function (engine, canvas) {
        engine.runRenderLoop(function () {
            if (sceneToRender && sceneToRender.activeCamera) {
                sceneToRender.render();
            }
        });
}
var engine = null;
    var scene = null;
    var sceneToRender = null;
    var createDefaultEngine = function() { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true,  disableWebGL2Support: false}); };
    
    var delayCreateScene = function () {
    var scene = new BABYLON.Scene(engine);
    const camera = new BABYLON.ArcRotateCamera("camera1", 0, 0, 10, BABYLON.Vector3.Zero(), scene);
    camera.setPosition(new BABYLON.Vector3(70, 0, 0));
    camera.attachControl(canvas, true);
    const light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.9;
    const box = BABYLON.MeshBuilder.CreateBox("box", { size: 1 }, scene);
    box.position.y = -20;
    var axesViewer = new BABYLON.AxesViewer(scene, 5);
    //create ground
    var ground = BABYLON.Mesh.CreateGroundFromHeightMap("ground", "textures/heightMap_orig.png", 1000, 1000, 1000, -10, 30, scene, false);
    var groundMaterial = new BABYLON.StandardMaterial("ground", scene);
    groundMaterial.diffuseTexture = new BABYLON.Texture("textures/ground.jpg", scene);
    groundMaterial.diffuseTexture.uScale = 10;
    groundMaterial.diffuseTexture.vScale = 10;
    groundMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    ground.position.y = -20;
    ground.material = groundMaterial;
    // Skybox erstellen'*/
    var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size: 1000}, scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBoxMaterial", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/misky", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skybox.material = skyboxMaterial;

    // Event Listener für Mausbewegungen
    canvas.addEventListener("pointerdown", handlePointerEvent);
    canvas.addEventListener("pointermove", handlePointerEvent);
    canvas.addEventListener("pointerup", handlePointerEvent);

    function handlePointerEvent(evt) {
        var pickResult = scene.pick(scene.pointerX, scene.pointerY);
        if (pickResult.hit) {
            //debu("Treffer: " + pickResult.pickedMesh.name);
            // Hier kannst du weitere Aktionen ausführen, wenn der Zeiger auf ein Hindernis trifft
        }
    }
    //------------------------------
    const wallWidth = 12;
        const wallHeight = 10;
        const brickSizes = [1, 2, 3, 4, 5, 6];
        let wall = [];
        let currentRow = [];
        let widthRemaining = wallWidth;
        let yOffset = -20;
        const gapSize = 0.1;

        function addBrick() {
            const brick = getRandomBrick(brickSizes, widthRemaining);
            if (brick !== null) {
                const brickMesh = BABYLON.MeshBuilder.CreateBox(`brick-${wall.length}-${currentRow.length}`, 
                {width: brick - gapSize, height: 1 - gapSize, depth: 1 - gapSize}, scene);
                brickMesh.position.x = (wallWidth / 2) - (widthRemaining - (brick / 2));
                brickMesh.position.y = yOffset;
                brickMesh.position.z = 0;

                // Farbe der Steine basierend auf der Auswahl
                const brickColor = "#885678";
                const brickMaterial = new BABYLON.StandardMaterial("brickMat", scene);
                brickMaterial.diffuseColor = BABYLON.Color3.FromHexString(brickColor);

                // Ursprüngliche Textur den gesamten Stein ausfüllen lassen
                const texture = new BABYLON.Texture("textures/steinmuster.png", scene);
                brickMaterial.diffuseTexture = texture;
                brickMaterial.diffuseTexture.uScale = 1;
                brickMaterial.diffuseTexture.vScale = 1;

                // Spiegelung reduzieren
                brickMaterial.specularColor = new BABYLON.Color3(0, 0, 0);

                brickMesh.material = brickMaterial;
                addTextToBrick(brickMesh);

                currentRow.push(brickMesh);
                widthRemaining -= brick;
            } else {
                if (currentRow.length > 0) {
                    wall.push(currentRow);
                    yOffset += 1;
                }
                currentRow = [];
                widthRemaining = wallWidth;
                addBrick();
            }
        }

        function getRandomBrick(brickSizes, maxWidth) {
            const suitableBricks = brickSizes.filter(size => size <= maxWidth);
            if (suitableBricks.length === 0) {
                return null;
            }
            const randomIndex = Math.floor(Math.random() * suitableBricks.length);
            return suitableBricks[randomIndex];
        }

        function addTextToBrick(brickMesh) {
            const inputText = "Huhu"
            // Dynamische Textur erstellen und Text darauf zeichnen
            const dynamicTexture = new BABYLON.DynamicTexture(`dynamicTexture-${brickMesh.name}`, {width:512, height:256}, scene, false);
            dynamicTexture.hasAlpha = true; // Transparenz aktivieren
            dynamicTexture.drawText(inputText, null, 140, "bold 60px Arial", "white", "transparent");

            const textMaterial = new BABYLON.StandardMaterial(`textMat-${brickMesh.name}`, scene);
            textMaterial.diffuseTexture = dynamicTexture;
            textMaterial.diffuseTexture.hasAlpha = true; // Transparenz aktivieren
            textMaterial.backFaceCulling = false; // Rückseiten culling deaktivieren

            const textPlane = BABYLON.MeshBuilder.CreatePlane(`textPlane-${brickMesh.name}`, {width: brickMesh.scaling.x, height: 1}, scene);
            textPlane.material = textMaterial;
            textPlane.position = brickMesh.position.clone();
            textPlane.position.z += 0.51; // Position der Vorderseite des Steins

            // Text-Plane rotieren, um sie parallel zur Vorderseite des Steins zu machen
            textPlane.rotation = new BABYLON.Vector3(0, 0, 0); 
            textPlane.rotationQuaternion = null; // Quaternion deaktivieren

            // Text-Plane horizontal spiegeln
            textPlane.scaling.x = -1;
        }
        document.addEventListener('DOMContentLoaded', function() {
            var button1 = document.getElementById('button1');
            var button2 = document.getElementById('button2');
            var button3 = document.getElementById('button3');
        
            button1.addEventListener('click', function() {
                debu('B1');
                addBrick();
            });
        
            button2.addEventListener('click', function() {
                debu('Button 2 wurde geklickt!');
            });
        
            button3.addEventListener('click', function() {
                debu('Button 3 wurde geklickt!');
            });
        });


    return scene;

    }//ende deled scene
    window.initFunction = async function() {
        var asyncEngineCreation = async function() {
            try {
                return createDefaultEngine();
                } catch(e) {
                    console.log("the available createEngine function failed. Creating the default engine instead");
                        return createDefaultEngine();
                    }
            }

            window.engine = await asyncEngineCreation();
            if (!engine) throw 'engine should not be null.';
            startRenderLoop(engine, canvas);
           
        window.scene = delayCreateScene();
    }
        
    initFunction().then(() => {sceneToRender = scene});
    window.addEventListener("resize", function () {engine.resize();});
//----------------------------------------------------------------------------------ende babylon--------------------------------------------------------------
    const toggleButton = document.getElementById("toggleButton");
    const toggleSectionContainer = document.getElementById("toggleSectionContainer");
    $("#toggleButton").click(function() { $("#toggleSectionContainer").fadeToggle("slow"); });

   