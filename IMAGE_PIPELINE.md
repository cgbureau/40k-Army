# Unit Image Pipeline

Purpose:
Download the primary product image for each Warhammer unit kit.

Source:
Element Games product images.

Process:

1. Read kit dataset:
/data/kits/{faction}.json

2. For each kit slug:

Construct product page:

https://elementgames.co.uk/games-workshop/warhammer-40k/{faction}/{kit_slug}

3. Extract the first product image.

4. Save image to:

/public/unit-images/{faction}/{unit-id}.jpg

Naming rules:

unit id in lowercase
hyphens only

Example:

boyz.jpg
nobz.jpg
battlewagon.jpg

Folder structure:

/public/unit-images/orks/
/public/unit-images/space-marines/
/public/unit-images/tyranids/

Images should be the primary product image with white background.
