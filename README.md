# CyberFortress (Hugo Site)
https://www.cyberfortress.com

## Dependencies
* [Hugo](https://gohugo.io/)
* [Google's Cloud SDK](https://cloud.google.com/sdk/)
* [Sass](https://sass-lang.com/) to regenerate the site's e.g. via the `gencss.sh` script

## To deploy
This site leverages Google Container Engine. To deploy, simply run the shell script `deploy-gke.sh` - first ensuring that the dependencies listed above have are installed on your computer and that you have appropriate permissions to the GCP project referenced in the script

```
$ sh deploy-gke.sh
```
