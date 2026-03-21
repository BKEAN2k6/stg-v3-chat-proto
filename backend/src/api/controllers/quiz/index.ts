import {type RouteConfigs} from '../../../types/routeconfig.js';
import {createQuiz} from './createQuiz.js';
import {createQuizPlayer} from './createQuizPlayer.js';
import {getHostQuiz} from './getHostQuiz.js';
import {getQuizWithCode} from './getQuizWithCode.js';
import {getPlayerQuiz} from './getPlayerQuiz.js';
import {removeQuizPlayer} from './removeQuizPlayer.js';
import {updateQuiz} from './updateQuiz.js';
import {createQuizAnswer} from './createQuizAnswer.js';
import {removeQuizAnswer} from './removeQuizAnswer.js';
import {createQuestionSet} from './createQuestionSet.js';
import {getQuestionSet} from './getQuestionSet.js';
import {updateQuestionSet} from './updateQuestionSet.js';
import {getQuestionSets} from './getQuestionSets.js';
import {removeQuestionSet} from './removeQuestionSet.js';

const quizController: RouteConfigs = {
  '/questions-sets': {
    get: {
      controller: getQuestionSets,
      access: ['super-admin'],
      response: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: {type: 'string'},
            title: {type: 'string'},
          },
          required: ['id', 'title'],
        },
      },
    },
    post: {
      controller: createQuestionSet,
      access: ['super-admin'],
      request: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            enum: ['quiz', 'questionnaire'],
          },
          title: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                language: {$ref: '#/definitions/LanguageCode'},
                text: {type: 'string'},
              },
              required: ['language', 'text'],
            },
          },
          description: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                language: {$ref: '#/definitions/LanguageCode'},
                text: {type: 'string'},
              },
              required: ['language', 'text'],
            },
          },
          questions: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                instruction: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      language: {$ref: '#/definitions/LanguageCode'},
                      text: {type: 'string'},
                    },
                    required: ['language', 'text'],
                  },
                },
                explanation: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      language: {$ref: '#/definitions/LanguageCode'},
                      text: {type: 'string'},
                    },
                    required: ['language', 'text'],
                  },
                },
                multiSelect: {
                  type: 'boolean',
                },
                strength: {$ref: '#/definitions/StrengthSlug'},
                choices: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      points: {
                        type: 'number',
                      },
                      label: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            language: {$ref: '#/definitions/LanguageCode'},
                            text: {type: 'string'},
                          },
                          required: ['language', 'text'],
                        },
                      },
                      isCorrect: {type: 'boolean'},
                    },
                    required: ['points', 'label', 'isCorrect'],
                  },
                },
              },
              required: [
                'instruction',
                'explanation',
                'multiSelect',
                'choices',
              ],
            },
          },
        },
        required: ['type', 'title', 'description', 'questions'],
      },
      response: {$ref: '#/definitions/QuestionSet'},
    },
  },
  '/question-sets/:id': {
    get: {
      controller: getQuestionSet,
      access: ['super-admin'],
      response: {$ref: '#/definitions/QuestionSet'},
    },
    patch: {
      controller: updateQuestionSet,
      access: ['super-admin'],
      request: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            enum: ['quiz', 'questionnaire'],
          },
          title: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                language: {$ref: '#/definitions/LanguageCode'},
                text: {type: 'string'},
              },
              required: ['language', 'text'],
            },
          },
          description: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                language: {$ref: '#/definitions/LanguageCode'},
                text: {type: 'string'},
              },
              required: ['language', 'text'],
            },
          },
          questions: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                },
                instruction: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      language: {$ref: '#/definitions/LanguageCode'},
                      text: {type: 'string'},
                    },
                    required: ['language', 'text'],
                  },
                },
                explanation: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      language: {$ref: '#/definitions/LanguageCode'},
                      text: {type: 'string'},
                    },
                    required: ['language', 'text'],
                  },
                },
                strength: {$ref: '#/definitions/StrengthSlug'},
                multiSelect: {
                  type: 'boolean',
                },
                choices: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: {
                        type: 'string',
                      },
                      points: {
                        type: 'number',
                      },
                      label: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            language: {$ref: '#/definitions/LanguageCode'},
                            text: {type: 'string'},
                          },
                          required: ['language', 'text'],
                        },
                      },
                      isCorrect: {type: 'boolean'},
                    },
                    required: ['points', 'label', 'isCorrect'],
                  },
                },
              },
              required: [
                'id',
                'instruction',
                'explanation',
                'multiSelect',
                'choices',
              ],
            },
          },
        },
        required: ['type', 'title', 'questions'],
      },
      response: {$ref: '#/definitions/QuestionSet'},
    },
    delete: {
      controller: removeQuestionSet,
      access: ['super-admin'],
    },
  },
  '/groups/:id/quizzes/': {
    post: {
      controller: createQuiz,
      access: [
        'community-member',
        'community-admin',
        'community-owner',
        'super-admin',
      ],
      request: {
        type: 'object',
        properties: {
          questionSet: {type: 'string'},
        },
        required: ['questionSet'],
      },
      response: {
        type: 'object',
        properties: {
          id: {type: 'string'},
          isStarted: {type: 'boolean'},
          isEnded: {type: 'boolean'},
          isCodeActive: {type: 'boolean'},
          canAnswer: {type: 'boolean'},
          code: {type: 'string'},
          questionSet: {
            type: 'object',
            properties: {
              type: {
                type: 'string',
                enum: ['quiz', 'questionnaire'],
              },
              title: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    language: {$ref: '#/definitions/LanguageCode'},
                    text: {type: 'string'},
                  },
                  required: ['language', 'text'],
                },
              },
              description: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    language: {$ref: '#/definitions/LanguageCode'},
                    text: {type: 'string'},
                  },
                  required: ['language', 'text'],
                },
              },
              questions: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: {
                      type: 'string',
                    },
                    instruction: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          language: {$ref: '#/definitions/LanguageCode'},
                          text: {type: 'string'},
                        },
                        required: ['language', 'text'],
                      },
                    },
                    explanation: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          language: {$ref: '#/definitions/LanguageCode'},
                          text: {type: 'string'},
                        },
                        required: ['language', 'text'],
                      },
                    },
                    strength: {$ref: '#/definitions/StrengthSlug'},
                    multiSelect: {
                      type: 'boolean',
                    },
                    choices: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          id: {
                            type: 'string',
                          },
                          points: {
                            type: 'number',
                          },
                          label: {
                            type: 'array',
                            items: {
                              type: 'object',
                              properties: {
                                language: {$ref: '#/definitions/LanguageCode'},
                                text: {type: 'string'},
                              },
                              required: ['language', 'text'],
                            },
                          },
                          isCorrect: {type: 'boolean'},
                        },
                        required: ['id', 'points', 'label', 'isCorrect'],
                      },
                    },
                  },
                  required: [
                    'id',
                    'instruction',
                    'explanation',
                    'multiSelect',
                    'choices',
                  ],
                },
              },
            },
            required: ['type', 'title', 'description', 'questions'],
          },
          currentQuestion: {
            type: 'string',
          },
          answers: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                question: {type: 'string'},
                choices: {type: 'array', items: {type: 'string'}},
                player: {type: 'string'},
              },
              required: ['question', 'choices', 'player'],
            },
          },
          players: {
            type: 'array',
            items: {$ref: '#/definitions/GroupGamePlayer'},
          },
          updatedAt: {type: 'string'},
        },
        required: [
          'id',
          'isStarted',
          'isEnded',
          'isCodeActive',
          'canAnswer',
          'code',
          'questionSet',
          'currentQuestion',
          'answers',
          'players',
          'updatedAt',
        ],
      },
    },
  },

  '/quizzes/:id/players': {
    post: {
      controller: createQuizPlayer,
      access: ['public'],
      request: {
        type: 'object',
        properties: {
          nickname: {type: 'string', minLength: 1, maxLength: 50},
          color: {type: 'string'},
          avatar: {type: 'string'},
        },
        required: ['nickname', 'color', 'avatar'],
      },
      response: {$ref: '#/definitions/GroupGamePlayer'},
    },
  },
  '/quizzes/:id/host': {
    get: {
      controller: getHostQuiz,
      access: [
        'community-member',
        'community-admin',
        'community-owner',
        'super-admin',
      ],
      response: {
        type: 'object',
        properties: {
          id: {type: 'string'},
          isStarted: {type: 'boolean'},
          isEnded: {type: 'boolean'},
          isCodeActive: {type: 'boolean'},
          canAnswer: {type: 'boolean'},
          code: {type: 'string'},
          questionSet: {
            type: 'object',
            properties: {
              type: {
                type: 'string',
                enum: ['quiz', 'questionnaire'],
              },
              title: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    language: {$ref: '#/definitions/LanguageCode'},
                    text: {type: 'string'},
                  },
                  required: ['language', 'text'],
                },
              },
              description: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    language: {$ref: '#/definitions/LanguageCode'},
                    text: {type: 'string'},
                  },
                  required: ['language', 'text'],
                },
              },
              questions: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: {
                      type: 'string',
                    },
                    instruction: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          language: {$ref: '#/definitions/LanguageCode'},
                          text: {type: 'string'},
                        },
                        required: ['language', 'text'],
                      },
                    },
                    explanation: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          language: {$ref: '#/definitions/LanguageCode'},
                          text: {type: 'string'},
                        },
                        required: ['language', 'text'],
                      },
                    },
                    strength: {$ref: '#/definitions/StrengthSlug'},
                    multiSelect: {
                      type: 'boolean',
                    },
                    choices: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          id: {
                            type: 'string',
                          },
                          points: {
                            type: 'number',
                          },
                          label: {
                            type: 'array',
                            items: {
                              type: 'object',
                              properties: {
                                language: {$ref: '#/definitions/LanguageCode'},
                                text: {type: 'string'},
                              },
                              required: ['language', 'text'],
                            },
                          },
                          isCorrect: {type: 'boolean'},
                        },
                        required: ['id', 'points', 'label', 'isCorrect'],
                      },
                    },
                  },
                  required: [
                    'id',
                    'instruction',
                    'explanation',
                    'multiSelect',
                    'choices',
                  ],
                },
              },
            },
            required: ['type', 'title', 'description', 'questions'],
          },
          currentQuestion: {
            type: 'string',
          },
          answers: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                question: {type: 'string'},
                choices: {type: 'array', items: {type: 'string'}},
                player: {type: 'string'},
              },
              required: ['question', 'choices', 'player'],
            },
          },
          players: {
            type: 'array',
            items: {$ref: '#/definitions/GroupGamePlayer'},
          },
          updatedAt: {type: 'string'},
        },
        required: [
          'id',
          'isStarted',
          'isEnded',
          'isCodeActive',
          'canAnswer',
          'code',
          'questionSet',
          'currentQuestion',
          'answers',
          'players',
          'updatedAt',
        ],
      },
    },
    patch: {
      controller: updateQuiz,
      access: [
        'community-member',
        'community-admin',
        'community-owner',
        'super-admin',
      ],
      request: {
        type: 'object',
        properties: {
          isStarted: {type: 'boolean'},
          isEnded: {type: 'boolean'},
          canAnswer: {type: 'boolean'},
          currentQuestion: {type: 'string'},
          answers: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                question: {type: 'string'},
                choices: {type: 'array', items: {type: 'string'}},
                player: {type: 'string'},
              },
              required: ['question', 'choices', 'player'],
            },
          },
        },
      },
      response: {
        type: 'object',
        properties: {
          id: {type: 'string'},
          isStarted: {type: 'boolean'},
          isEnded: {type: 'boolean'},
          isCodeActive: {type: 'boolean'},
          canAnswer: {type: 'boolean'},
          code: {type: 'string'},
          questionSet: {
            type: 'object',
            properties: {
              type: {
                type: 'string',
                enum: ['quiz', 'questionnaire'],
              },
              title: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    language: {$ref: '#/definitions/LanguageCode'},
                    text: {type: 'string'},
                  },
                  required: ['language', 'text'],
                },
              },
              description: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    language: {$ref: '#/definitions/LanguageCode'},
                    text: {type: 'string'},
                  },
                  required: ['language', 'text'],
                },
              },
              questions: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: {
                      type: 'string',
                    },
                    instruction: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          language: {$ref: '#/definitions/LanguageCode'},
                          text: {type: 'string'},
                        },
                        required: ['language', 'text'],
                      },
                    },
                    explanation: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          language: {$ref: '#/definitions/LanguageCode'},
                          text: {type: 'string'},
                        },
                        required: ['language', 'text'],
                      },
                    },
                    strength: {$ref: '#/definitions/StrengthSlug'},
                    multiSelect: {
                      type: 'boolean',
                    },
                    choices: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          id: {
                            type: 'string',
                          },
                          points: {
                            type: 'number',
                          },
                          label: {
                            type: 'array',
                            items: {
                              type: 'object',
                              properties: {
                                language: {$ref: '#/definitions/LanguageCode'},
                                text: {type: 'string'},
                              },
                              required: ['language', 'text'],
                            },
                          },
                          isCorrect: {type: 'boolean'},
                        },
                        required: ['id', 'points', 'label', 'isCorrect'],
                      },
                    },
                  },
                  required: [
                    'id',
                    'instruction',
                    'explanation',
                    'multiSelect',
                    'choices',
                  ],
                },
              },
            },
            required: ['type', 'title', 'description', 'questions'],
          },
          currentQuestion: {
            type: 'string',
          },
          answers: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                question: {type: 'string'},
                choices: {type: 'array', items: {type: 'string'}},
                player: {type: 'string'},
              },
              required: ['question', 'choices', 'player'],
            },
          },
          players: {
            type: 'array',
            items: {$ref: '#/definitions/GroupGamePlayer'},
          },
          updatedAt: {type: 'string'},
        },
        required: [
          'id',
          'isStarted',
          'isEnded',
          'isCodeActive',
          'canAnswer',
          'code',
          'questionSet',
          'currentQuestion',
          'answers',
          'players',
          'updatedAt',
        ],
      },
    },
  },
  '/quizzes/:code': {
    get: {
      controller: getQuizWithCode,
      access: ['public'],
      response: {
        type: 'object',
        properties: {
          id: {type: 'string'},
          isRegistered: {type: 'boolean'},
        },
        required: ['id', 'isRegistered'],
      },
    },
  },
  '/quizzes/:id/player': {
    get: {
      controller: getPlayerQuiz,
      access: ['public'],
      response: {
        type: 'object',
        properties: {
          id: {type: 'string'},
          isStarted: {type: 'boolean'},
          isEnded: {type: 'boolean'},
          canAnswer: {type: 'boolean'},
          questionSet: {
            type: 'object',
            properties: {
              type: {
                type: 'string',
                enum: ['quiz', 'questionnaire'],
              },
              title: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    language: {$ref: '#/definitions/LanguageCode'},
                    text: {type: 'string'},
                  },
                  required: ['language', 'text'],
                },
              },
              description: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    language: {$ref: '#/definitions/LanguageCode'},
                    text: {type: 'string'},
                  },
                  required: ['language', 'text'],
                },
              },
              questions: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: {
                      type: 'string',
                    },
                    instruction: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          language: {$ref: '#/definitions/LanguageCode'},
                          text: {type: 'string'},
                        },
                        required: ['language', 'text'],
                      },
                    },
                    explanation: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          language: {$ref: '#/definitions/LanguageCode'},
                          text: {type: 'string'},
                        },
                        required: ['language', 'text'],
                      },
                    },
                    strength: {$ref: '#/definitions/StrengthSlug'},
                    multiSelect: {
                      type: 'boolean',
                    },
                    choices: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          id: {
                            type: 'string',
                          },
                          points: {
                            type: 'number',
                          },
                          label: {
                            type: 'array',
                            items: {
                              type: 'object',
                              properties: {
                                language: {$ref: '#/definitions/LanguageCode'},
                                text: {type: 'string'},
                              },
                              required: ['language', 'text'],
                            },
                          },
                          isCorrect: {type: 'boolean'},
                        },
                        required: ['id', 'points', 'label', 'isCorrect'],
                      },
                    },
                  },
                  required: [
                    'id',
                    'instruction',
                    'explanation',
                    'multiSelect',
                    'choices',
                  ],
                },
              },
            },
            required: ['type', 'title', 'description', 'questions'],
          },
          currentQuestion: {
            type: 'string',
          },
          players: {
            type: 'array',
            items: {$ref: '#/definitions/GroupGamePlayer'},
          },
          player: {$ref: '#/definitions/GroupGamePlayer'},
          answers: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                question: {type: 'string'},
                choices: {type: 'array', items: {type: 'string'}},
                id: {type: 'string'},
              },
              required: ['question', 'choices', 'id'],
            },
          },
        },
        required: [
          'id',
          'isStarted',
          'isEnded',
          'canAnswer',
          'questionSet',
          'currentQuestion',
          'players',
          'player',
          'answers',
        ],
      },
    },
  },
  '/quizzes/:id/anwers': {
    post: {
      controller: createQuizAnswer,
      access: ['public'],
      request: {
        type: 'object',
        properties: {
          question: {type: 'string'},
          choices: {type: 'array', items: {type: 'string'}},
        },
        required: ['question', 'choices'],
      },
      response: {
        type: 'object',
        properties: {
          id: {type: 'string'},
          question: {type: 'string'},
          choices: {type: 'array', items: {type: 'string'}},
        },
        required: ['id', 'question', 'choices'],
      },
    },
  },
  '/quizzes/:id/players/:playerId': {
    delete: {
      controller: removeQuizPlayer,
      access: [
        'community-member',
        'community-admin',
        'community-owner',
        'super-admin',
      ],
    },
  },
  '/quizzes/:id/answers/:answerId': {
    delete: {
      controller: removeQuizAnswer,
      access: ['public'],
    },
  },
};

export default quizController;
