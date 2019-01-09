# CleanedSPFL

## Deployment instructions
SPFL is a composition of three services:
- a static HTML/JS website used to display the application and load the data,
- a node.js server serving the data about flower species and bouquets
- a flask application serving the position of flowers in bouquets

The following instructions explain how to deploy these services on a server running Ubuntu 18.04, using the Nginx webserver.

### Flask application setup
Follow the instructions [here](https://www.digitalocean.com/community/tutorials/how-to-serve-flask-applications-with-uswgi-and-nginx-on-ubuntu-18-04) to serve the application using uWSGI.

The configuration files created during the process are shown below.



### Nginx configuration file
