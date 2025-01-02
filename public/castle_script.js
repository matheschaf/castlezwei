const canvas = document.getElementById("renderCanvas");
        const engine = new BABYLON.Engine(canvas, true);
        const createScene = () => {
            const scene = new BABYLON.Scene(engine);

            var camera = new BABYLON.ArcRotateCamera("camera", BABYLON.Tools.ToRadians(45), BABYLON.Tools.ToRadians(45), 10, BABYLON.Vector3.Zero(), scene);
            camera.attachControl(canvas, true);

            
            camera.wheelDeltaPercentage = 0.006; // Zoomgeschwindigkeit verlangsamen

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
                const brickColor = document.getElementById("brickColor").value;
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
            const inputText = document.getElementById("inputText").value;
            if (inputText.length > 20) {
                alert("Der Text darf maximal 20 Buchstaben lang sein!");
                return;
            }

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