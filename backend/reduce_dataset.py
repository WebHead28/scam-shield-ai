import os
import random
import shutil

def sample_images(src, dest, n):
    os.makedirs(dest, exist_ok=True)
    images = os.listdir(src)
    sampled = random.sample(images, n)

    for img in sampled:
        shutil.copy(os.path.join(src, img), os.path.join(dest, img))

# TRAIN
sample_images("dataset/train/ai", "dataset_small/train/ai", 6000)
sample_images("dataset/train/real", "dataset_small/train/real", 6000)

# VAL
sample_images("dataset/val/ai", "dataset_small/val/ai", 1500)
sample_images("dataset/val/real", "dataset_small/val/real", 1500)
