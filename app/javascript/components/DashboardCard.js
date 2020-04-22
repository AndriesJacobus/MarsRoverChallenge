// import "./bootstrap";
import React from 'react';
import PropTypes from "prop-types"
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

class DashboardCard extends React.Component {
  render() {
    return (
      <Card className="hoverable" style={{marginBottom: 25,}}>
        <CardActionArea>
          <CardMedia
            image={this.props.resource}
            style={{height: 150,}} >

            <Typography
              className="card-title"
              gutterBottom
              variant="h5"
              component="h2"
              style={{
                  fontSize: 30,
                  paddingTop: 100,
                  color: "#42A5F5",
                  textShadow: "1px 1px white",
                  textAlign: "center",
              }}>

              {this.props.title}
            </Typography>
          </CardMedia>
          <CardContent style={{height: 150}}>
            <Typography variant="body2" color="textSecondary" component="p">
              {this.props.content}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Button variant="contained" size="small" color="primary" href={this.props.link}
            style={{
              marginLeft: 15,
              color: "white",
              marginBottom: 10,
            }}>

            {this.props.linkText}
          </Button>
        </CardActions>
      </Card>
    );
  }
}

DashboardCard.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
  link: PropTypes.string,
  linkText: PropTypes.string,
  resource: PropTypes.string,
};

export default DashboardCard