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
                return false if (!self.input.lines[i + 1].delete(allowedCharacters).empty? && self.input.lines[i + 1].delete(allowedCharacters) != "\n")
                i = i + 2
            end

            # Input is valid
            return true
        end

        return false
    end

    def change_heading_90_deg(heading, direction)
        headings = ["N", "E", "S", "W"]

        if direction == "L"
            # Change heading - left by one in arr
            if heading == "N"
                return "W"
            else
                return headings[headings.index(heading).to_i - 1]
            end
        end

        if direction == "R"
            # Change heading - right by one in arr
            if heading == "W"
                return "N"
            else
                return headings[headings.index(heading).to_i + 1]
            end
        end
    end

    def do_steps(start_pos, instructions)
        grid = self.input.lines[0].split
        pos = start_pos.split
        x = pos[0].to_i
        y = pos[1].to_i
        heading = pos[2]
        outBoundsString = "Out of bounds. Last known coordinates: "

        # Make sure start pos is valid
        if x < 0 || y < 0 || x > grid[0].to_i || y > grid[1].to_i
            return "Invalid starting position"
        end

        instructions.chars.each do |instruction|
            if instruction == "L" || instruction == "R"
                # Change heading - left 90°
                heading = change_heading_90_deg(heading, instruction)
            end

            if instruction == "M"
                # Change x or y
                # If we would go out of bounds after the instuction, don't change it and return current position
                case heading
                    when "N"
                        # Change y
                        if y == grid[1]
                            return outBoundsString + x.to_s + " " + y.to_s + " " + heading
                        end

                        y = y + 1

                    when "E"
                        # Change x
                        if x == grid[0]
                            return outBoundsString + x.to_s + " " + y.to_s + " " + heading
                        end

                        x = x + 1

                    when "S"
                        # Change y
                        if y == 0
                            return outBoundsString + x.to_s + " " + y.to_s + " " + heading
                        end

                        y = y - 1

                    else    # "W"
                        # Change x
                        if x == 0
                            return outBoundsString + x.to_s + " " + y.to_s + " " + heading
                        end

                        x = x - 1

                    end
            end
        end

        return x.to_s + " " + y.to_s + " " + heading
    end

    def calculate_output
        # puts "Input:"
        # puts self.input

        # If input is invalid, return false
        return false if validate_input == false

        # NOTE:
        # If the rover goes out of bounds, the returned output will be
        # its last coordinates and heading before it left the grid

        # Go through each rover and get consolidated output
        i = 1
        self.output = ""
        ((self.input.lines.count - 1) / 2).times do ||
            self.output += do_steps(self.input.lines[i], self.input.lines[i + 1])
            i = i + 2

            if i < self.input.lines.count
                self.output += "\n"
            end
        end

        return true
    end
    
    private 
      def generate_random_id
        self.id = SecureRandom.random_number(2147483646)
      end
end
