export const imageRetrieve = (folder) => {
    const images = import.meta.glob('/src/assets/home/**/*.{png,jpg,jpeg,svg}', { eager: true });

    // Filter only images that belong to the requested folder
    const imageList = Object.entries(images)
        .filter(([key]) => key.includes(`/${folder}/`)) // Match the folder dynamically
        .map(([_, image], index) => (
            <img key={index} src={image.default} alt={`img-${index}`} style={(images.length==5 && index==5) ? {gridColumn: 'span 2', width: '100%'} : {gridColumn: 'span 1'}} />
        ));

    return imageList;
}