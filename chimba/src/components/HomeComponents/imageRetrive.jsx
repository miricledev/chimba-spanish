export const imageRetrieve = (folder) => {
    const images = import.meta.glob('/src/assets/**/*.{png,jpg,jpeg,svg}', { eager: true });

    // Filter only images that belong to the requested folder
    const imageList = Object.entries(images)
        .filter(([key]) => key.includes(`/${folder}/`)) // Match the folder dynamically
        .map(([_, image], index) => (
            <img key={index} className="sm:w-30 sm:h-18 2xl:w-40 2xl:h-25" src={image.default} alt={`img-${index}`} />
        ));

    return imageList;
}