from ast import While
from datetime import datetime
import cv2
import os

from pathlib import Path


def getCurrentTimeFormatted():
    return (
        str(datetime.now()).split(" ")[0]
        + "-"
        + "-".join(str(datetime.now()).split(" ")[1].split(":")).split(".")[0]
    )


# Function to save the image
def saveImage(image, prediction):
    # Create a folder with the name as userName
    Path("static/Captured/{}".format(prediction)).mkdir(parents=True, exist_ok=True)

    # Save the images inside the previously created folder
    currentTime = getCurrentTimeFormatted()
    imagePath = "static/Captured/{}/{}.jpg".format(prediction, currentTime)
    result = cv2.imwrite(
        imagePath,
        image,
    )
    return (result, prediction, imagePath, datetime.now())


def startUp():
    # Start the video camera
    vc = cv2.VideoCapture(0)

    return vc


def tearDown(vc):
    # Stop the video camera
    vc.release()
    # Close all Windows
    cv2.destroyAllWindows()


def detectFaces(vc, faceCascade):

    # Initialize the classifier

    # Call the trained model yml file to recognize faces
    recognizer = cv2.face.LBPHFaceRecognizer_create()

    trainingFile = Path("training.yml")
    if trainingFile.is_file():
        recognizer.read("training.yml")
        # file exists

    # Capture the frame/image
    _, img = vc.read()

    # assign the image to a variable called original_img to later save it
    original_img = img.copy()

    # Get the gray version of our image
    gray_img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Get the coordinates of the location of the face in the picture
    faces = faceCascade.detectMultiScale(
        gray_img, scaleFactor=1.2, minNeighbors=5, minSize=(50, 50)
    )

    # Draw a rectangle at the location of the coordinates
    for (x, y, w, h) in faces:

        cv2.rectangle(img, (x, y), (x + w, y + h), (0, 255, 0), 2)
        coords = [x, y, w, h]

        roi_img = original_img[
            coords[1] : coords[1] + coords[3], coords[2] : coords[2] + coords[3]
        ]

        # Check if there is a training file
        if trainingFile.is_file():
            id, _ = recognizer.predict(gray_img[y : y + h, x : x + w])
            result = saveImage(original_img, str(id))
            return result
        else:
            result = saveImage(original_img, "Unknown")
            return result

    return (False, False, False, False)
