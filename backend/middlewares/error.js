function handleError(err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }

    if (err.status === 404) {
        res.status(404).send('Sorry, we could not find the page you were looking for!');
    } else {
        console.error(err.stack);
        res.status(500).send('Something went wrong on the server!');
    }
}

module.exports = handleError;