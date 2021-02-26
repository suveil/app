const whitelist = {
	"youtube.com": true,
	"youtu.be": true,
	"app.getmetastream.com": true,
	"google.com": true,
};

const isWhitelistedURL = (url: string): boolean => {
	let truncatedURL = url.replace(/^https:\/\//, ""); //take out the protocol stuff
	truncatedURL = truncatedURL.replace(/^www\./, ""); //take out the protocol stuff

	for (const whitelistedURL in whitelist) {
		if (
			truncatedURL.match(`^${whitelistedURL}/`) || //check if it matches with the link, and add a slash in case it isn't the index page (youtube.com/c/channel)
			truncatedURL === whitelistedURL //if the url doesn't have a slash after it, it should be equal to the whitelisted url (youtube.com). this blocks stuff like youtube.comz, too.
		) {
			return true;
		}
	}

	return false;
};

export default isWhitelistedURL;
