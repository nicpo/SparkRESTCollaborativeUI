'use strict';
app.factory('Message', [function () {
    var instance = {
        prompts: {
            kmeans: "The number of times to run the algorithm. As a globally optimal solution is not guaranteed, running k-means several times will return the best clustering result.",
            minibatch: "Mini-batch gradient descent computes the gradient at each iteration using a subset (batch) of training examples. This parameter specifies the fraction of the dataset used as a batch. When set to 1.0, stochastic gradient descent (SGD) is calculated by computing the gradient over the whole dataset." +
            "<br><br>A typical batch size is 2—100 examples.",
            regularisation: "Regularization is used to prevent the model from overfitting the training data.L1 or L2 specifies the type of the regularizer to use and the regularization parameter (C) controls the relative importance of the regularization term." +
            "<br><br>A large value of C will classify more training examples correctly but may overfit the data. A small value will misclassify more examples."
        }
    };
    return instance;

}]);