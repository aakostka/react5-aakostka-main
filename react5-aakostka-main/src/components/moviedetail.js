import React, { Component } from 'react';
import { fetchMovie, submitReview } from "../actions/movieActions";
import { connect } from 'react-redux';
import { Card, ListGroup, ListGroupItem, Button, Form } from 'react-bootstrap';
import { BsStarFill } from 'react-icons/bs';
import { Image } from 'react-bootstrap';

import styles from './moviedetail.module.css';

class MovieDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            review: {
                text: '',
                rating: 1
            }
        };
    }
    
    updateReviewText = (e) => {
        this.setState({
            review: {
                ...this.state.review,
                text: e.target.value
            }
        });
    }
    
    updateReviewRating = (e) => {
        this.setState({
            review: {
                ...this.state.review,
                rating: parseInt(e.target.value, 10)
            }
        });
    }

    componentDidMount() {
        const {dispatch} = this.props;
        if (this.props.selectedMovie == null) {
            dispatch(fetchMovie(this.props.movieId));
        }
    }

    submitReview = () => {
        const { text, rating } = this.state.review;
        // Submit the review using the submitReview action
        this.props.dispatch(submitReview(this.props.selectedMovie._id, text, rating));
        // Clear the form
        this.setState({
            review: {
                text: '',
                rating: 1
            }
        });
    }

    render() {
        const DetailInfo = () => {
            if (!this.props.selectedMovie) {
                return <div>Loading....</div>
            }

            return (
            <>
            <div className={styles.card}>
                <Card className={styles.card}>
                    <Card.Header className={styles.labelText}><b>Movie Detail</b></Card.Header>
                    <Card.Body>
                        <Image className={styles.image} src={this.props.selectedMovie.imageUrl} thumbnail />
                    </Card.Body>
                    <ListGroup>
                        <ListGroupItem><b>{this.props.selectedMovie.title}</b></ListGroupItem>
                        <ListGroupItem>
                            {this.props.selectedMovie.actors.map((actor, i) =>
                                <p key={i}>
                                    <b>{actor.Actor}</b> {actor.Character}
                                </p>)}
                        </ListGroupItem>
                        <ListGroupItem><h4><BsStarFill/> {this.props.selectedMovie.avgRating}</h4></ListGroupItem>
                    </ListGroup>
                    <Card.Body className={styles.labelText}>
                        {this.props.selectedMovie.reviews.map((review, i) =>
                            <p key={i}>
                                <b>{review.username}</b>&nbsp; {review.review}
                                &nbsp;  <BsStarFill /> {review.rating}
                            </p>
                        )}
                    </Card.Body>
                </Card>
            </div>
            </>
            )
        }

        return (
            <div>
                <DetailInfo />
                <Form className={styles.formContainer}>
                    <Form.Group controlId="reviewText">
                        <Form.Label className={styles.labelText}>Review</Form.Label>
                        <Form.Control as="textarea" rows={3} onChange={this.updateReviewText} value={this.state.review.text} placeholder="Watched this movie? Leave a review!" />
                    </Form.Group>

                    <Form.Group controlId="reviewRating">
                        <Form.Label className={styles.labelText}>Rating</Form.Label>
                        <Form.Control as="select" onChange={this.updateReviewRating} value={this.state.review.rating}>
                            <option value={1}>1</option>
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                            <option value={4}>4</option>
                            <option value={5}>5</option>
                        </Form.Control>
                    </Form.Group>
                    <Button onClick={this.submitReview}>Submit Review</Button>
                </Form>
            </div>
        );
        
    }
}

const mapStateToProps = state => {
    return {
        selectedMovie: state.movie.selectedMovie
    }
}

export default connect(mapStateToProps)(MovieDetail);

