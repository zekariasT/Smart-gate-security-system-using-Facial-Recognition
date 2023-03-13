import logging
from re import T
import time
import os
import cv2
import requests

from threading import Timer
from detect_faces import detectFaces, startUp, tearDown
from dotenv import load_dotenv

import logging

# Enable logging
logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s", level=logging.INFO
)
logger = logging.getLogger(__name__)


def main() -> None:

    # Load environment variables
    load_dotenv()

    url = os.getenv("BACKEND_URL")
    device_id = os.getenv("DEVICE_ID")

    last_detect_time = 0

    DETECTION_INTERVAL = 10

    vc = startUp()
    faceCascade = cv2.CascadeClassifier("haarcascade_frontalface_default.xml")

    print("[INFO] Video Capture is now starting please stay still")

    while True:
        # Get the time since the last detection
        time_since_detection = time.time() - last_detect_time

        # Make sure the last detection is greater than the interval or skip
        if time_since_detection < DETECTION_INTERVAL:
            continue
        (saved, prediction, location, detection_date) = detectFaces(vc, faceCascade)

        if saved:

            print("Saved")
            last_detect_time = time.time()
            new_detection = {
                "prediction": prediction,
                "image_location": location,
                "detection_date": detection_date,
            }

            res = "Request failed"
            try:
                res = requests.post(url, data=new_detection)
            except:
                print("Connection error")
            print(res)


if __name__ == "__main__":
    main()
