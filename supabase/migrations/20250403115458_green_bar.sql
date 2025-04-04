/*
  # Add saved predictions and ratings functionality

  1. New Tables
    - `saved_predictions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `post_id` (uuid, references posts)
      - `status` (text, nullable) - can be 'won' or 'lost'
      - `created_at` (timestamptz)

    - `prediction_ratings`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `post_id` (uuid, references posts)
      - `rating` (integer) - 1 to 5 stars
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for:
      - Users can read their own saved predictions
      - Users can create/update/delete their own saved predictions
      - Users can create/read their own ratings
*/

-- Create saved_predictions table
CREATE TABLE saved_predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  status text CHECK (status IN ('won', 'lost')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, post_id)
);

-- Create prediction_ratings table
CREATE TABLE prediction_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, post_id)
);

-- Enable RLS
ALTER TABLE saved_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE prediction_ratings ENABLE ROW LEVEL SECURITY;

-- Saved predictions policies
CREATE POLICY "Users can read their own saved predictions"
  ON saved_predictions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own saved predictions"
  ON saved_predictions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own saved predictions"
  ON saved_predictions FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved predictions"
  ON saved_predictions FOR DELETE
  USING (auth.uid() = user_id);

-- Prediction ratings policies
CREATE POLICY "Users can read their own ratings"
  ON prediction_ratings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own ratings"
  ON prediction_ratings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX saved_predictions_user_id_idx ON saved_predictions(user_id);
CREATE INDEX saved_predictions_post_id_idx ON saved_predictions(post_id);
CREATE INDEX prediction_ratings_user_id_idx ON prediction_ratings(user_id);
CREATE INDEX prediction_ratings_post_id_idx ON prediction_ratings(post_id);