import logging
from re import T
import time
import os
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

    load_dotenv()

    url = os.getenv("BACKEND_URL")
    device_id = os.getenv("DEVICE_ID")

    last_detect_time = 0

    DETECTION_INTERVAL = 20

    vc = startUp()

    print("[INFO] Video Capture is now starting please stay still")

    while True:
        time_since_detection = time.time() - last_detect_time
        if time_since_detection < DETECTION_INTERVAL:
            continue
        (saved, prediction, location, detection_time) = detectFaces(vc)

        if saved:

            last_detect_time = time.time()
            new_detection = {
                "device_id": device_id,
                "prediction": prediction,
                "image_location": location,
                "detection_time": detection_time,
            }

            requests.post(url, json=new_detection)


if __name__ == "__main__":
    main()
