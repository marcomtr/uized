document.addEventListener('DOMContentLoaded', () => {
    const ratioWidthInput = document.getElementById('ratio-width');
    const ratioHeightInput = document.getElementById('ratio-height');
    const pixelWidthInput = document.getElementById('pixel-width');
    const pixelHeightInput = document.getElementById('pixel-height');
    const imagePlaceholder = document.getElementById('image-placeholder');
    const customTextInput = document.getElementById('custom-text-label');
    const hasCustomTextCheckbox = document.getElementById('has-custom-text');
    const downloadButton = document.getElementById('download-button');
    const copyLinkInput = document.getElementById('copy-link');
    const copyUrlButton = document.getElementById('copy-url-button');

    let selectedFont = 'open-sans';
    let selectedBgColor = 'f5f5f5';
    let selectedFgColor = '262626';

    const calculateDimensions = (isWidthChange) => {
        const ratioWidth = parseFloat(ratioWidthInput.value);
        const ratioHeight = parseFloat(ratioHeightInput.value);

        if (isNaN(ratioWidth) || isNaN(ratioHeight) || ratioWidth <= 0 || ratioHeight <= 0) return;

        if (isWidthChange) {
            const pixelWidth = parseFloat(pixelWidthInput.value);
            if (!isNaN(pixelWidth)) {
                pixelHeightInput.value = Math.round((pixelWidth * ratioHeight) / ratioWidth);
            }
        } else {
            const pixelHeight = parseFloat(pixelHeightInput.value);
            if (!isNaN(pixelHeight)) {
                pixelWidthInput.value = Math.round((pixelHeight * ratioWidth) / ratioHeight);
            }
        }

        updateImageSrc();
    };

    const updateImageSrc = () => {
        const width = pixelWidthInput.value;
        const height = pixelHeightInput.value;
        let imageUrl = `https://placehold.co/${width}x${height}/${selectedBgColor}/${selectedFgColor}.svg?font=${selectedFont}`;

        if (hasCustomTextCheckbox.checked) {
            imageUrl += `&text=${encodeURIComponent(customTextInput.value)}`;
        }

        imagePlaceholder.src = imageUrl;
        updateCopyLinkInput(imageUrl); // Update the copy link input field

    };

    const updateCopyLinkInput = (imageUrl) => {
        copyLinkInput.value = imageUrl;
    };

    const attachClickEvent = (selector, callback) => {
        document.querySelectorAll(selector).forEach(button => {
            button.addEventListener('click', callback);
        });
    };

    attachClickEvent('.font-button', function () {
        // Reset all buttons to their default state
        document.querySelectorAll('.font-button').forEach(btn => {
            btn.classList.add('bg-zinc-50' );
            btn.classList.remove('ring-2', 'ring-indigo-700', 'ring-offset-2', 'bg-white' );
        });
    
        // Add classes to the clicked button
        this.classList.remove('bg-zinc-50',);
        this.classList.add('ring-2', 'ring-indigo-700', 'ring-offset-2', 'bg-white',);
    
        // Update the selected font
        selectedFont = this.dataset.font;
        updateImageSrc();
    });
    
    attachClickEvent('[data-theme-bg]', function () {
        document.querySelectorAll('[data-theme-bg]').forEach(btn => {
            btn.classList.remove('ring-2', 'ring-indigo-700', 'ring-offset-2');
        });

        this.classList.add('ring-2', 'ring-indigo-700', 'ring-offset-2');

        selectedBgColor = this.dataset.themeBg;
        updateImageSrc();
    });

    attachClickEvent('[data-theme-fg]', function () {
        document.querySelectorAll('[data-theme-fg]').forEach(btn => {
            btn.classList.remove('ring-2', 'ring-indigo-700', 'ring-offset-2');
        });

        this.classList.add('ring-2', 'ring-indigo-700', 'ring-offset-2');

        selectedFgColor = this.dataset.themeFg;
        updateImageSrc();
    });


    const downloadImage = async () => {
        const imageUrl = imagePlaceholder.src;

        if (!imageUrl) {
            console.error('Image URL is not set.');
            return;
        }

        try {
            // Fetch the image as a blob
            const response = await fetch(imageUrl);
            if (!response.ok) throw new Error('Failed to fetch image');
            const blob = await response.blob();
            
            // Create a link element and trigger the download
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `image-placeholder-${Date.now()}.svg`; // Ensure a unique file name
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Clean up the object URL
            URL.revokeObjectURL(link.href);
        } catch (error) {
            console.error('Error downloading image:', error);
        }
    };

    copyUrlButton.addEventListener('click', () => {
        const url = copyLinkInput.value;
    
        navigator.clipboard.writeText(url).then(() => {
            // Change button text to "Copied"
            copyUrlButton.textContent = 'Copied';
            
            // Optionally, revert the text back to "Copy" after a short delay
            setTimeout(() => {
                copyUrlButton.textContent = 'Copy URL';
            }, 2000); // Revert after 2 seconds
        }).catch(err => {
            console.error('Failed to copy URL: ', err);
        });
    });

    document.getElementById('has-custom-text').addEventListener('change', function() {
        var customTextContainer = document.getElementById('custom-text-container');
        if (this.checked) {
            customTextContainer.classList.remove('hidden');
        } else {
            customTextContainer.classList.add('hidden');
        }
    });

    // Delay the display of the image placeholder by 1 second
    setTimeout(function() {
        document.getElementById('image-placeholder').classList.remove('opacity-0');
    }, 500);
    
    downloadButton.addEventListener('click', downloadImage);

    pixelWidthInput.addEventListener('input', () => calculateDimensions(true));
    pixelHeightInput.addEventListener('input', () => calculateDimensions(false));
    ratioWidthInput.addEventListener('input', () => calculateDimensions(true));
    ratioHeightInput.addEventListener('input', () => calculateDimensions(false));

    customTextInput.addEventListener('input', updateImageSrc);
    hasCustomTextCheckbox.addEventListener('change', updateImageSrc);

    // Initialize the dimensions and image source
    calculateDimensions(true); // Calculate the height based on the initial width and aspect ratio
});
