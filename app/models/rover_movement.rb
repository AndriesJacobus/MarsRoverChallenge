class RoverMovement < ApplicationRecord
    require 'securerandom'
    before_create :generate_random_id

    def validate_input
        allowedCharacters = "LRM"
        if self.input != nil && self.input.length > 0 && self.input.lines.count >= 3
            # Minimum requirements satisfied.
            # Make sure that the number of lines makes sense (i.e 1 line for grid + series of 2-liners for rovers)
            if (self.input.lines.count - 1) % 2 != 0
                return false
            end

            # Make sure first line is valid
            # Check for space seperation
            first = self.input.lines[0]
            return false unless first.include?(" ")

            # Check that two valid grid numbers are given
            gridNumbers = first.split
            return false if (gridNumbers.length != 2 || gridNumbers[0].to_i == 0 || gridNumbers[1].to_i == 0)

            # Check that direction strings only contain "L", "R", and "M"
            i = 1
            ((self.input.lines.count - 1) / 2).times do ||
                return false if !self.input.lines[i + 1].delete(allowedCharacters).empty? && self.input.lines[i + 1].delete(allowedCharacters) != "\n"
                i = i + 2
            end

            # Input is valid
            return true
        end

        return false
    end

    def calculate_output
        # puts "Input:"
        # puts self.input

        # If input is invalid, return false
        return false if validate_input == false

        self.output = "test"
        return true
    end
    
    private 
      def generate_random_id
        self.id = SecureRandom.random_number(2147483646)
      end
end
