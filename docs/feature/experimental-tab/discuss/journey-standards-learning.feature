Feature: Standards-Based Barry Harris Learning
  As a jazz musician learning the Barry Harris method
  I want to practice with familiar jazz standards and explore different CAGED shapes
  So that I can master improvisation through material I already know

  Background:
    Given the HarrisApp is running
    And the Experimental Tab feature is enabled
    And the jazz standards library contains 15 standards
    And the API endpoint "/barry-harris/generate-instructions" is available

  # ============================================================================
  # SCENARIO 1: Happy Path - Complete Journey (Steps 1-9)
  # ============================================================================

  Scenario: Complete learning journey from practice session to guitar
    # Step 1: Practice Session Begins
    Given I am a jazz student seeking practice direction
    When I open the HarrisApp
    And I navigate to the "Experimental" tab
    Then I should see the Standards Library option prominently displayed
    And my emotional state should be "Motivated & Slightly Uncertain"
    And I should think "What should I practice today?"

    # Step 2: Discover Standards Library
    When I click on "Standards Library"
    Then the library should load within 2 seconds
    And I should see a list of 15 jazz standards
    And each standard should display:
      | Field      | Example           |
      | Name       | Autumn Leaves     |
      | Composer   | Joseph Kosma      |
      | Key        | G minor           |
      | Difficulty | beginner          |
      | Tempo      | Medium Ballad     |
    And my emotional state should be "Discovery & Relief"
    And I should think "Aha! This is exactly what I was looking for"

    # Step 3: Browse and Select Standard
    When I browse the standards list
    And I click on "Autumn Leaves"
    Then the standard should be highlighted as selected
    And the URL should update to include "?standard=autumn-leaves"
    And the app should transition to the standard detail view
    And my emotional state should be "Engaged & Confident"
    And I should think "I know this tune, let me see the Barry Harris approach"

    # Step 4: View Dual Progressions
    Then I should see the "Original Progression" section labeled clearly
    And the original progression should display:
      | Chord    |
      | Cm7      |
      | F7       |
      | BbMaj7   |
      | EbMaj7   |
      | Am7b5    |
      | D7       |
      | Gm7      |
      | Gm7      |
    And I should see the "Improvisation Progression" section labeled clearly
    And the improvisation progression should display:
      | Chord    |
      | Cm7      |
      | F7       |
      | BbMaj7   |
      | Am7b5    |
      | D7       |
      | Gm7      |
    And I should see explanatory text: "Barry Harris simplification removes EbMaj7 passing chord for clearer ii-V patterns"
    And my emotional state should be "Understanding & Appreciation"
    And I should think "Ah! Barry Harris simplifies the progression for improvisation"

    # Step 5: Generate Barry Harris Lines (Default Shape)
    When I click the "Generate Lines" button
    Then I should immediately see a loading indicator
    And the API should be called with:
      | Parameter       | Value                                              |
      | chords          | ["Cm7","F7","BbMaj7","Am7b5","D7","Gm7"]          |
      | caged_shape     | E                                                  |
      | guitar_position | E                                                  |
    And the API should respond within 3 seconds
    And my emotional state should be "Anticipation & Slight Tension"
    And I should think "Let's see what the Barry Harris method produces"

    # Step 6: View Generated Lines (ABC Notation)
    Then the loading indicator should disappear
    And I should see the generated ABC notation rendered
    And the notation should include chord symbols
    And the lines should be visually readable
    And my emotional state should be "Satisfaction & Validation"
    And I should think "It worked! I have lines to practice"
    And my anxiety about quality should be resolved

    # Step 7: Curiosity About Other Shapes
    When I notice the shape selector showing buttons: C, A, G, E, D
    And I see that "E" is highlighted as the current shape
    And I click the "A" button
    Then I should see a loading indicator
    And my emotional state should be "Curiosity & Exploration"
    And I should think "How would this sound in a different position?"

    # Step 8: Compare Shapes & Make Decision
    Then the "A" button should be highlighted
    And the API should respond within 3 seconds with new lines
    And I should see the A shape lines rendered
    When I mentally compare the A shape with the E shape
    And I decide "A shape feels more comfortable"
    Then my emotional state should be "Confidence & Empowerment"
    And I should think "I'll start with A shape today, it feels more comfortable"
    And my confidence level should be very high

    # Step 9: Move to Guitar Practice
    When I take my guitar
    And I play the generated A shape lines
    Then the total time from opening the app should be less than 5 minutes
    And my emotional state should be "Motivated & Empowered"
    And I should think "From question to practicing in <5 minutes"
    And I should be in a flow state

  # ============================================================================
  # SCENARIO 2: Shape Exploration Focus (Steps 6-8)
  # ============================================================================

  Scenario: Exploring multiple CAGED shapes for same standard
    Given I have already generated lines for "Autumn Leaves" in E shape
    And I can see the shape selector with buttons: C, A, G, E, D
    And the "E" button is highlighted

    When I click the "A" button
    Then the API should regenerate lines with shape "A"
    And the "A" button should be highlighted
    And the new lines should render within 3 seconds

    When I click the "G" button
    Then the API should regenerate lines with shape "G"
    And the "G" button should be highlighted
    And the new lines should render within 3 seconds

    When I click the "D" button
    Then the API should regenerate lines with shape "D"
    And the "D" button should be highlighted
    And the new lines should render within 3 seconds

    And I should have explored 4 different shapes total
    And my confidence in shape selection should increase
    And I should think "I can choose the shape that fits my playing style"

  # ============================================================================
  # SCENARIO 3: Iterating Across Multiple Standards (Step 10)
  # ============================================================================

  Scenario: Exploring multiple standards in one session
    Given I have completed the journey for "Autumn Leaves"
    And I practiced with the A shape lines

    When I navigate back to the Standards Library
    Then I should return within 30 seconds
    And the standards list should still be loaded

    When I select "Blue Bossa"
    Then I should see the dual progressions for "Blue Bossa"
    And I should see:
      | Original Progression                |
      | Cm7, Fm7, Dm7b5, G7, Cm7, Ebm7, Ab7, DbMaj7, Dm7b5, G7, Cm7 |
    And I should see:
      | Improvisation Progression           |
      | Cm7, Fm7, Dm7b5, G7, Ebm7, Ab7, DbMaj7, Dm7b5, G7 |

    When I generate lines for "Blue Bossa" with shape "E"
    Then the lines should render within 3 seconds
    And I should be able to practice a second standard seamlessly

    And my session should include:
      | Standard       | Shapes Explored |
      | Autumn Leaves  | E, A            |
      | Blue Bossa     | E               |
    And I should be in a flow state
    And I should think "Let me try a different standard with different harmonic context"

  # ============================================================================
  # SCENARIO 4: Beginner First-Time Experience (Variation)
  # ============================================================================

  Scenario: Beginner user encountering standards library for first time
    Given I am a beginner jazz student (variation: beginner-first-time)
    And I have never used the standards library before

    When I open the Standards Library
    Then I should feel slight anxiety: "Which standard should I start with?"
    And I should see difficulty labels clearly: "beginner", "intermediate", "advanced"

    When I filter by difficulty "beginner"
    Then I should see 5 beginner standards:
      | Standard       | Difficulty |
      | Autumn Leaves  | beginner   |
      | Blue Bossa     | beginner   |
      | Summertime     | beginner   |
      | Take The A Train | beginner |
      | So What        | beginner   |

    When I select "Autumn Leaves" (recommended for beginners)
    And I view the dual progressions
    Then I should see explanatory text about chord symbols (if needed)
    And I should feel reassured: "This is the right difficulty for me"

    When I generate lines with default shape "E"
    And I view the lines
    Then the lines should be playable at beginner level
    And I should feel confident: "I can play this"

  # ============================================================================
  # SCENARIO 5: Advanced User with Complex Standard (Variation)
  # ============================================================================

  Scenario: Advanced user selecting complex standard
    Given I am an advanced jazz student (variation: advanced-complex-standard)
    And I have extensive Barry Harris experience

    When I browse the standards library
    And I select "Stella By Starlight" (advanced difficulty)
    Then I should see complex dual progressions:
      | Original Progression (28 chords)     |
      | Em7b5, A7b9, Cm7, F7, Fm7, Bb7, ... |

    When I generate lines with shape "E"
    Then I should see advanced patterns used:
      | Pattern   |
      | ChordUp   |
      | TriadUp   |
      | ThirdUp   |
      | Pivot     |
    And I should scrutinize the voice leading quality
    And I should expect more complex melodic lines
    And my confidence level should be very high

  # ============================================================================
  # SCENARIO 6: Performance Requirements
  # ============================================================================

  @performance
  Scenario: System meets critical success factors
    Given I am measuring performance metrics

    # CSF 1: Frictionless Entry (<30 seconds)
    When I open the HarrisApp
    And I navigate to Standards Library
    And I select a standard
    And I click "Generate Lines"
    Then the total time from app open to generation should be less than 30 seconds

    # CSF 2: Fast Generation (<3 seconds)
    When the API is called to generate lines
    Then the response time should be less than 3 seconds
    And the 95th percentile response time should be less than 3 seconds

    # CSF 3: Dual Progression Clarity
    When I view any standard detail
    Then both progressions should be labeled clearly
    And the explanation should be visible
    And I should understand the pedagogical value

    # CSF 4: Quality Musical Output
    When lines are generated for any difficulty level
    Then the lines should sound musical when played
    And the patterns should be appropriate for the difficulty level

    # CSF 5: Effortless Shape Exploration
    When I switch between shapes
    Then each shape change should feel instant (<3 seconds)
    And the shape selector should be obvious and accessible

  # ============================================================================
  # SCENARIO 7: Error Handling - API Timeout
  # ============================================================================

  @error_handling
  Scenario: API timeout during line generation
    Given I have selected "Autumn Leaves"
    And I click "Generate Lines"
    When the API takes longer than 5 seconds to respond
    Then I should see a timeout message: "Generation is taking longer than expected"
    And I should see a "Retry" button
    And I should think "Is it stuck? Did it fail?"

    When I click the "Retry" button
    Then the API should be called again
    And if successful within 3 seconds, the lines should render
    And my confidence should be restored

  # ============================================================================
  # SCENARIO 8: Error Handling - API Error
  # ============================================================================

  @error_handling
  Scenario: API error (500) during line generation
    Given I have selected "Autumn Leaves"
    And I click "Generate Lines"
    When the API returns a 500 error
    Then I should see an error message: "Unable to generate lines. Please try again."
    And I should see a "Retry" button
    And I should NOT see a generic "Error occurred" message
    And I should think "Something went wrong, but I can retry"

    When I click the "Retry" button
    Then the API should be called again
    And if successful, the lines should render

  # ============================================================================
  # SCENARIO 9: Error Handling - Standards Library Not Loading
  # ============================================================================

  @error_handling
  Scenario: Standards library fails to load
    Given I navigate to the Standards Library
    When the standards data fails to load
    Then I should see a loading indicator initially
    And after 3 seconds, I should see an error message: "Unable to load standards library"
    And I should see a "Retry" button
    And I should think "Is the API down?"

    When I click the "Retry" button
    Then the app should attempt to reload the standards
    And if successful, the 15 standards should display

  # ============================================================================
  # SCENARIO 10: Error Handling - ABC Rendering Failure
  # ============================================================================

  @error_handling
  Scenario: ABC notation fails to render
    Given lines have been successfully generated
    When the abcjs library fails to render the notation
    Then I should see a fallback text representation of the lines
    And I should see an error message: "Unable to render notation. Displaying text format."
    And I should still be able to read the pitch names
    And I should think "I can still see the notes even if rendering failed"

  # ============================================================================
  # SCENARIO 11: Navigation and URL State
  # ============================================================================

  @navigation
  Scenario: Shareable URL with standard parameter
    Given I have selected "Autumn Leaves"
    And the URL is "https://harrisapp.com/experimental?standard=autumn-leaves"

    When I copy the URL and share it with a friend
    And my friend opens the URL
    Then the app should navigate directly to "Autumn Leaves" detail view
    And the dual progressions should be displayed
    And my friend should skip the browsing step
    And the journey should start at Step 4 (View Dual Progressions)

  @navigation
  Scenario: Navigating back to standards library
    Given I am viewing lines for "Autumn Leaves"
    When I click the "Back to Library" button or breadcrumb
    Then I should return to the standards list within 1 second
    And the standards list should still be loaded (not refetched)
    And I should be able to select another standard immediately

  # ============================================================================
  # SCENARIO 12: Metrics and Analytics
  # ============================================================================

  @metrics
  Scenario: Tracking user engagement metrics
    Given I complete a full learning session
    And I browse 3 standards: "Autumn Leaves", "Blue Bossa", "All The Things You Are"
    And I try 2 shapes for "Autumn Leaves": E and A
    And I try 1 shape for "Blue Bossa": E
    And I try 3 shapes for "All The Things You Are": C, A, E

    Then the following metrics should be recorded:
      | Metric                        | Value |
      | standards_browsed_per_session | 3     |
      | shapes_tried_per_standard     | 2     |
      | time_to_first_generation      | <30s  |
      | total_journey_time            | <5min |
      | return_rate                   | 100%  |

  # ============================================================================
  # SCENARIO 13: Anti-patterns Validation
  # ============================================================================

  @anti_patterns
  Scenario: Validating anti-patterns are avoided
    # Anti-pattern 1: Hidden Library
    Given I open the Experimental Tab
    Then the Standards Library should be prominently displayed
    And I should NOT have to search through menus to find it

    # Anti-pattern 2: Single Progression
    Given I select any standard
    Then I should see BOTH original and improvisation progressions
    And I should NOT see only the improvisation progression

    # Anti-pattern 3: No Loading Indicator
    Given I click "Generate Lines"
    Then a loading indicator should appear immediately
    And I should NOT think the app is frozen

    # Anti-pattern 4: Shape Selector Hidden
    Given lines have been generated
    Then the shape selector should be visible
    And I should NOT have to search for how to try other shapes

    # Anti-pattern 5: Poor Error Messages
    Given any error occurs
    Then I should see a specific error message with context
    And I should NOT see a generic "Error occurred" message

    # Anti-pattern 6: Slow API
    Given any API call is made
    Then the response should be within 5 seconds
    And I should NOT wait longer than 5 seconds without feedback

    # Anti-pattern 7: Unplayable Lines
    Given lines are generated for any difficulty level
    Then the lines should be playable at that difficulty level
    And I should NOT receive lines that are too complex for my level

  # ============================================================================
  # SCENARIO 14: Emotional Arc Validation
  # ============================================================================

  @emotional_arc
  Scenario: Validating positive emotional journey
    Given I track my emotional state throughout the journey

    Then my emotional states should be:
      | Step | Emotional State                 | Valence  |
      | 01   | Motivated & Slightly Uncertain  | Positive |
      | 02   | Discovery & Relief              | Positive |
      | 03   | Engaged & Confident             | Positive |
      | 04   | Understanding & Appreciation    | Positive |
      | 05   | Anticipation & Slight Tension   | Neutral  |
      | 06   | Satisfaction & Validation       | Positive |
      | 07   | Curiosity & Exploration         | Positive |
      | 08   | Confidence & Empowerment        | Positive |
      | 09   | Motivated & Empowered           | Positive |
      | 10   | Flow State & Mastery Building   | Positive |

    And there should be NO significant frustration points
    And my confidence should build progressively
    And I should end in a flow state

  # ============================================================================
  # SCENARIO 15: Artifact Tracking Validation
  # ============================================================================

  @artifacts
  Scenario: Validating shared artifacts are tracked correctly
    Given I complete the full journey for "Autumn Leaves"

    Then the following artifacts should be created and tracked:
      | Artifact                  | Created At Step | Used At Steps | Persistence |
      | practice_intention        | 01              | 02, 03        | session     |
      | selected_standard         | 03              | 04, 05, 06    | session, url|
      | chords_original           | 04              | display only  | database    |
      | chords_improvisation      | 04              | 05            | database    |
      | generation_request        | 05              | 06            | api         |
      | generated_lines_E         | 06              | 07, 08        | ui_display  |
      | shape_selection_A         | 07              | 08            | session     |
      | generated_lines_A         | 08              | 09            | ui_display  |
      | shape_decision            | 08              | 09            | session     |
      | practice_session          | 09              | 10            | real_world  |

    And each artifact should have a single source of truth
    And artifacts should be accessible across relevant steps
