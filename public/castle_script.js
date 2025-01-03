const debu = (inp) => console.log(inp);
const canvas = document.getElementById("renderCanvas");
        const engine = new BABYLON.Engine(canvas, true);

const createScene = () => {
            const scene = new BABYLON.Scene(engine);

            var camera = new BABYLON.ArcRotateCamera("camera", BABYLON.Tools.ToRadians(45), BABYLON.Tools.ToRadians(45), 10, BABYLON.Vector3.Zero(), scene);
            camera.attachControl(canvas, true);
            camera.alpha = Math.PI / 2; // Horizontale Drehung
            camera.beta = Math.PI / 4;  // Vertikale Drehung
            camera.radius = 20;         // Abstand zum Ziel
            camera.target = new BABYLON.Vector3(1, -10, 1); // Zielposition
            camera.setPosition(new BABYLON.Vector3(10, -10, 10));
            
            
            camera.wheelDeltaPercentage = 0.009; // Zoomgeschwindigkeit verlangsamen

            const light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);
            light.intensity = 1.0; // Lichtintensität erhöht

            const frontLight = new BABYLON.DirectionalLight("frontLight", new BABYLON.Vector3(0, 0, -1), scene);
            frontLight.position = new BABYLON.Vector3(0, 0, 10); // Beleuchtung von vorn
            frontLight.intensity = 1.0; // Lichtintensität erhöht
            var ground = BABYLON.Mesh.CreateGroundFromHeightMap("ground", "textures/heightMap_orig.png", 500, 500, 500, -10, 30, scene, false);
            var groundMaterial = new BABYLON.StandardMaterial("ground", scene);
            groundMaterial.diffuseTexture = new BABYLON.Texture("textures/ground.jpg", scene);
            groundMaterial.diffuseTexture.uScale = 10;
            groundMaterial.diffuseTexture.vScale = 10;
            groundMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
            ground.position.y = -20;
            ground.material = groundMaterial;
            return scene;
        };

        const scene = createScene();
//-------------------------------------------------
xoff=-20;yoff=-20;zoff=-20;
const offset = new BABYLON.Vector3(xoff,yoff,zoff);

const sphereMaterial = new BABYLON.StandardMaterial("sphereMaterial", scene);
const referenceSphere = BABYLON.MeshBuilder.CreateSphere("referenceSphere", { diameter: 0.5 }, scene);
referenceSphere.position = offset;
sphereMaterial.diffuseColor = new BABYLON.Color3(255,0,0); // Red color
referenceSphere.material = sphereMaterial;

//---------------------------------------------------

// Add lights to the scene
const light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);

// Material for the towers and building
const towerMaterial = new BABYLON.StandardMaterial("towerMaterial", scene);
towerMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5); // Grey color
towerMaterial.diffuseTexture = new BABYLON.Texture("https://assets.babylonjs.com/environments/bricktile.jpg", scene);

// Round Tower
const roundTower = BABYLON.MeshBuilder.CreateCylinder("roundTower", { diameter: 2, height: 6 }, scene);
roundTower.position = new BABYLON.Vector3(-5+xoff, 3+yoff, zoff);
roundTower.material = towerMaterial;

// Square Tower
const squareTower = BABYLON.MeshBuilder.CreateBox("squareTower", { width: 3, height: 8, depth: 3 }, scene);
squareTower.position = new BABYLON.Vector3(5+xoff, 3+yoff, zoff);
squareTower.material = towerMaterial;

// Building
const building = BABYLON.MeshBuilder.CreateBox("building", { width: 6, height: 4, depth: 4 }, scene);
building.position = new BABYLON.Vector3(xoff, 2+yoff, 5+zoff);
building.material = towerMaterial;




        const wallWidth = 12;
        const wallHeight = 10;
        const brickSizes = [1, 2, 3, 4, 5, 6];
        let wall = [];
        let currentRow = [];
        let widthRemaining = wallWidth;
        let yOffset = -10;
        const gapSize = 0.1;

        function addBrick() {
            const brick = getRandomBrick(brickSizes, widthRemaining);
            if (brick !== null) {
                const brickMesh = BABYLON.MeshBuilder.CreateBox(`brick-${wall.length}-${currentRow.length}`, 
                {width: brick - gapSize, height: 1 - gapSize, depth: 1 - gapSize}, scene);
                brickMesh.position.x = (wallWidth / 2) - (widthRemaining - (brick / 2));
                brickMesh.position.y = yOffset;
                brickMesh.position.z = -20;

                // Farbe der Steine basierend auf der Auswahl
                const brickColor = "#8B4513"; // SaddleBrown
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
            const inputText = "Manjana";

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

        engine.runRenderLoop(() => {
            scene.render();
        });

        window.addEventListener("resize", () => {
            engine.resize();
        });

    const toggleButton = document.getElementById("toggleButton");
    const toggleSectionContainer = document.getElementById("toggleSectionContainer");
    $("#toggleButton").click(function() { $("#toggleSectionContainer").fadeToggle("slow"); });
    document.getElementById("button1").addEventListener("click", function() {
        addBrick();
    });
    document.getElementById("button2").addEventListener("click", function() {
        debu("Button 2 clicked");
    });
    document.getElementById("button3").addEventListener("click", function() {
        debu("Button 3 clicked");
    });
