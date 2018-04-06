REACT_APP_TMDB_KEY="yourKey" npm run build

aws s3 sync build/ s3://hannibal-vector-front-end --acl public-read